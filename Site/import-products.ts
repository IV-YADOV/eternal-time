#!/usr/bin/env npx ts-node
/**
 * import-products.ts
 *
 * Читает папки с товарами и загружает их на сайт через API.
 *
 * Структура папки:
 *   /products-folder/
 *     10. A130WE-7ADF/
 *       A130WE-7A.jpg                  ← фото товара
 *       A130WE-7A_5.jpg
 *       ceo.docx                       ← первая строка = цена, второй абзац = описание
 *       Документ Microsoft Word.docx   ← таблица: Параметр | Значение → specs JSON
 *
 * Использование:
 *   npx ts-node import-products.ts \
 *     --dir ./products \
 *     --url http://localhost:3000 \
 *     --brandId <ID> \
 *     --categoryId <ID>
 *
 * Зависимости:
 *   npm install mammoth form-data node-fetch@2 minimist
 *   npm install -D @types/node @types/minimist ts-node typescript
 */

import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import FormData from "form-data";
import fetch from "node-fetch";
import minimist from "minimist";

// ─── CLI аргументы ─────────────────────────────────────────────────────────────

const argv = minimist(process.argv.slice(2));
const PRODUCTS_DIR: string = argv.dir || "./products";
const SITE_URL: string = (argv.url || "http://localhost:3000").replace(/\/$/, "");
const DRY_RUN: boolean = !!argv["dry-run"];
const BRAND_ID: string = argv.brandId || "";
const CATEGORY_ID: string = argv.categoryId || "";
const DEFAULT_STOCK: number = Number(argv.stock ?? 10);

if (!BRAND_ID || !CATEGORY_ID) {
  console.error(`
❌  Укажи brandId и categoryId:

  npx ts-node import-products.ts \\
    --dir ./products \\
    --url http://localhost:3000 \\
    --brandId <ID> \\
    --categoryId <ID>

Получить ID можно через:
  docker exec -it <container_name> npx prisma studio
  или: docker exec -it <container_name> npx prisma db seed
  или SQL: SELECT id, name FROM "Brand";
`);
  process.exit(1);
}

// ─── Парсинг ceo.docx (цена + описание) ───────────────────────────────────────

interface ParsedCeo {
  price: number;
  description: string;
}

async function parseCeoDocx(filePath: string): Promise<ParsedCeo> {
  const result = await mammoth.extractRawText({ path: filePath });
  const raw = result.value.trim();

  const paragraphs = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Первый абзац = цена. Может быть "5 500" или "5500" или "5 500,00"
  const priceRaw = paragraphs[0] ?? "0";
  const price = parseFloat(priceRaw.replace(/\s/g, "").replace(",", ".")) || 0;

  // Остальные абзацы = описание
  const description = paragraphs.slice(1).join("\n\n").trim();

  return { price, description };
}

// ─── Парсинг таблицы характеристик из "Документ Microsoft Word.docx" ──────────
//
// Таблица выглядит так:
//   Параметр          | Значение
//   Модель            | A130WE-7ADF
//   Вес               | 54 г
//   Стекло            | Акриловое (Resin Glass / пластик)
//   ...

async function parseSpecsDocx(filePath: string): Promise<Record<string, string>> {
  const specs: Record<string, string> = {};

  // mammoth конвертирует таблицы в HTML — используем это
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;

  // Регулярки для парсинга HTML-таблицы (без внешних зависимостей)
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  const tagRegex = /<[^>]+>/g;

  const decodeHtml = (s: string) =>
    s
      .replace(tagRegex, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, "")
      .trim();

  let rowMatch: RegExpExecArray | null;
  let isHeaderRow = true;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells: string[] = [];

    let cellMatch: RegExpExecArray | null;
    cellRegex.lastIndex = 0;

    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(decodeHtml(cellMatch[1]));
    }

    if (cells.length < 2) continue;

    const key = cells[0].trim();
    const value = cells[1].trim();

    // Пропускаем строку-заголовок ("Параметр" | "Значение")
    if (isHeaderRow) {
      isHeaderRow = false;
      if (key.toLowerCase() === "параметр") continue;
    }

    if (key && value) {
      specs[key] = value;
    }
  }

  return specs;
}

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function makeSlug(folderName: string): string {
  // "10. A130WE-7ADF" → "a130we-7adf"
  return folderName
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeModelName(folderName: string): string {
  // "10. A130WE-7ADF" → "A130WE-7ADF"
  return folderName.replace(/^\d+\.\s*/, "").trim();
}

// ─── Загрузка через API ────────────────────────────────────────────────────────

async function uploadProduct(params: {
  name: string;
  slug: string;
  price: number;
  description: string;
  specs: Record<string, string>;
  imageFiles: string[];
}): Promise<{ id: string; slug: string }> {
  const { name, slug, price, description, specs, imageFiles } = params;

  const form = new FormData();
  form.append("name", name);
  form.append("slug", slug);
  form.append("brandId", BRAND_ID);
  form.append("categoryId", CATEGORY_ID);
  form.append("price", String(price));
  form.append("description", description);
  form.append("inStock", String(DEFAULT_STOCK));
  form.append("availability", "in_stock");
  form.append("specs", JSON.stringify(specs));

  for (const imgPath of imageFiles) {
    form.append("images", fs.createReadStream(imgPath), {
      filename: path.basename(imgPath),
    });
  }

  const response = await fetch(`${SITE_URL}/api/products`, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

// ─── Главная логика ────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`❌  Папка не найдена: ${PRODUCTS_DIR}`);
    process.exit(1);
  }

  const entries = fs
    .readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort((a, b) => {
      const numA = parseInt(a.name.match(/^(\d+)/)?.[1] ?? "0");
      const numB = parseInt(b.name.match(/^(\d+)/)?.[1] ?? "0");
      return numA - numB;
    });

  console.log(`\n📦  Найдено папок: ${entries.length}`);
  if (DRY_RUN) console.log("🔍  DRY-RUN режим — данные не отправляются\n");

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const entry of entries) {
    const folderPath = path.join(PRODUCTS_DIR, entry.name);
    const name = makeModelName(entry.name);
    const slug = makeSlug(entry.name);
    const files = fs.readdirSync(folderPath);

    // ── Картинки: главное фото (без суффикса _N) идёт первым ──
    const imageFiles = files
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => {
        const aHasSuffix = /_\d+\.\w+$/.test(a);
        const bHasSuffix = /_\d+\.\w+$/.test(b);
        if (!aHasSuffix && bHasSuffix) return -1;
        if (aHasSuffix && !bHasSuffix) return 1;
        return a.localeCompare(b);
      })
      .map((f) => path.join(folderPath, f));

    // ── ceo.docx → цена + описание ──
    const ceoFile =
      files.find((f) => f.toLowerCase() === "ceo.docx") ??
      files.find((f) => /^ceo/i.test(f) && f.endsWith(".docx"));

    let price = 0;
    let description = "";

    if (ceoFile) {
      try {
        const parsed = await parseCeoDocx(path.join(folderPath, ceoFile));
        price = parsed.price;
        description = parsed.description;
      } catch (err) {
        console.warn(`  ⚠️  Ошибка ceo.docx: ${err}`);
      }
    } else {
      console.warn(`  ⚠️  ceo.docx не найден: ${entry.name}`);
    }

    // ── "Документ Microsoft Word.docx" → specs таблица ──
    const specsFile =
      files.find((f) =>
        f.toLowerCase().includes("microsoft word") && f.endsWith(".docx")
      ) ??
      // запасной вариант: любой docx кроме ceo.docx
      files.find(
        (f) => f.endsWith(".docx") && f.toLowerCase() !== "ceo.docx"
      );

    let specs: Record<string, string> = {};

    if (specsFile) {
      try {
        specs = await parseSpecsDocx(path.join(folderPath, specsFile));
      } catch (err) {
        console.warn(`  ⚠️  Ошибка specs docx: ${err}`);
      }
    }

    // ── Вывод прогресса ──
    console.log(`\n🕐  ${entry.name}`);
    console.log(`    slug:        ${slug}`);
    console.log(`    price:       ${price} ₽`);
    console.log(`    images:      ${imageFiles.length} шт`);
    console.log(`    description: ${description.slice(0, 80)}${description.length > 80 ? "…" : ""}`);
    console.log(`    specs (${Object.keys(specs).length} строк):`);
    Object.entries(specs).forEach(([k, v]) => {
      console.log(`      • ${k}: ${v}`);
    });

    if (DRY_RUN) {
      console.log("    ✅  [dry-run] пропускаем отправку");
      success++;
      continue;
    }

    try {
      const result = await uploadProduct({
        name,
        slug,
        price,
        description,
        specs,
        imageFiles,
      });
      console.log(`    ✅  Загружен: id=${result.id}`);
      success++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`    ❌  Ошибка: ${msg}`);
      errors.push(`${entry.name}: ${msg}`);
      failed++;
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`✅  Успешно: ${success} из ${entries.length}`);
  if (failed > 0) {
    console.log(`❌  Ошибок:  ${failed}`);
    errors.forEach((e) => console.log(`   → ${e}`));
  }
  console.log(`──────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
