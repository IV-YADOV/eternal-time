#!/usr/bin/env npx ts-node
/**
 * import-products.ts
 *
 * Умный импорт товаров с проверкой существующих, обновлением и логированием.
 *
 * Структура папки:
 *   /products/
 *     10. A130WE-7ADF/
 *       A130WE-7A.jpg
 *       сео.docx                      ← первая строка = цена, остальное = описание
 *       Документ Microsoft Word.docx  ← таблица Параметр | Значение → specs
 *
 * Режимы:
 *   --mode skip    (по умолчанию) — пропускать уже существующие товары
 *   --mode update  — обновлять существующие товары (цена, описание, specs, фото)
 *   --mode force   — удалить существующий и создать заново
 *
 * Использование:
 *   npx ts-node import-products.ts \
 *     --dir ./products \
 *     --url http://localhost:3000 \
 *     --categoryId <ID> \
 *     --mode skip
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
const CATEGORY_ID: string = argv.categoryId || "";
const DEFAULT_STOCK: number = Number(argv.stock ?? 10);
const MODE: "skip" | "update" | "force" = ["skip", "update", "force"].includes(argv.mode)
  ? argv.mode
  : "skip";

if (!CATEGORY_ID) {
  console.error(`
❌  Укажи categoryId:

  npx ts-node import-products.ts \\
    --dir ./products \\
    --url http://localhost:3000 \\
    --categoryId <ID> \\
    --mode skip|update|force
`);
  process.exit(1);
}

// ─── Маппинг брендов ───────────────────────────────────────────────────────────

const BRAND_MAP: Array<{ id: string; name: string; prefixes: string[] }> = [
  {
    id: "43b42f41-29d5-4bd6-8715-31869969e51a",
    name: "G-Shock",
    prefixes: [
      "GA-", "GA2", "GBA-", "GBD-", "GBX-", "GCW-", "GD-", "GLG-", "GM-",
      "GMW-", "GPR-", "GR-", "GRB-", "GST-", "GW-", "GWF-", "GWG-", "GWR-",
      "GWN-", "DW-", "MTG-", "MRG-",
    ],
  },
  {
    id: "cba725f9-2359-4097-9748-10d3ea1c62f3",
    name: "Vintage",
    prefixes: [
      "A100", "A120", "A130", "A158", "A159", "A160", "A163", "A168", "A171",
      "AE-", "AEQ-", "AW-",
      "LA6", "LA7", "LA8",
      "F-", "W-", "WS-", "CA-", "DB-",
    ],
  },
  {
    id: "d8f9047d-cce6-4d7e-87fa-03b234a255f3",
    name: "Baby-G",
    prefixes: [
      "BG-", "BA-", "BAX-", "BGD-", "BGA-", "BGR-", "BGS-", "BLX-", "BSA-",
    ],
  },
  {
    id: "73e8cb35-bd0a-4a61-9033-a851749c20ca",
    name: "Pro-Trek",
    prefixes: ["PRG-", "PRW-", "PAG-", "PAW-", "PRT-"],
  },
  {
    id: "d399d58f-4d55-46e6-9848-40cd41a818bc",
    name: "Edifice",
    prefixes: [
      "MTP-", "MTP", "NWA-", "MWQ-", "MWA-", "LTP-", "LTP", "LQ-",
      "EF-", "EFR-", "EFS-", "EFV-", "ECB-", "EQB-", "EQS-", "EQW-",
      "ERA-", "ERW-",
    ],
  },
];

function detectBrandId(modelName: string): string {
  const upper = modelName.toUpperCase();
  for (const brand of BRAND_MAP) {
    for (const prefix of brand.prefixes) {
      if (upper.startsWith(prefix.toUpperCase())) return brand.id;
    }
  }
  console.warn(`  ⚠️  Бренд не определён для "${modelName}", используем G-Shock`);
  return BRAND_MAP[0].id;
}

function detectBrandName(modelName: string): string {
  const upper = modelName.toUpperCase();
  for (const brand of BRAND_MAP) {
    for (const prefix of brand.prefixes) {
      if (upper.startsWith(prefix.toUpperCase())) return brand.name;
    }
  }
  return BRAND_MAP[0].name;
}

// ─── Типы для лога ─────────────────────────────────────────────────────────────

type LogStatus = "created" | "updated" | "skipped" | "failed" | "dry-run";

interface LogEntry {
  folder: string;
  slug: string;
  brand: string;
  price: number;
  images: number;
  specsCount: number;
  status: LogStatus;
  productId?: string;
  error?: string;
  timestamp: string;
}

const logEntries: LogEntry[] = [];

// ─── Парсинг сео.docx ──────────────────────────────────────────────────────────

interface ParsedCeo {
  price: number;
  description: string;
}

async function parseCeoDocx(filePath: string): Promise<ParsedCeo> {
  const result = await mammoth.extractRawText({ path: filePath });
  const raw = result.value.trim();
  const paragraphs = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const priceRaw = paragraphs[0] ?? "0";
  const price = parseFloat(priceRaw.replace(/\s/g, "").replace(",", ".")) || 0;
  const description = paragraphs.slice(1).join("\n\n").trim();
  return { price, description };
}

// ─── Парсинг таблицы характеристик ────────────────────────────────────────────

async function parseSpecsDocx(filePath: string): Promise<Record<string, string>> {
  const specs: Record<string, string> = {};
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  const tagRegex = /<[^>]+>/g;

  const decodeHtml = (s: string) =>
    s.replace(tagRegex, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, "").trim();

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
    if (isHeaderRow) {
      isHeaderRow = false;
      if (key.toLowerCase() === "параметр") continue;
    }
    if (key && value) specs[key] = value;
  }

  return specs;
}

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function makeSlug(folderName: string): string {
  return folderName
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeModelName(folderName: string): string {
  return folderName.replace(/^\d+\.\s*/, "").trim();
}

// ─── API: проверить существование товара ───────────────────────────────────────

interface ExistingProduct {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
}

async function checkExists(slug: string): Promise<ExistingProduct | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/products/${slug}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json() as ExistingProduct;
  } catch {
    return null;
  }
}

// ─── API: создать товар ────────────────────────────────────────────────────────

async function createProduct(params: {
  name: string;
  slug: string;
  brandId: string;
  price: number;
  description: string;
  specs: Record<string, string>;
  imageFiles: string[];
}): Promise<{ id: string; slug: string }> {
  const { name, slug, brandId, price, description, specs, imageFiles } = params;

  const form = new FormData();
  form.append("name", name);
  form.append("slug", slug);
  form.append("brandId", brandId);
  form.append("categoryId", CATEGORY_ID);
  form.append("price", String(price));
  form.append("description", description);
  form.append("inStock", String(DEFAULT_STOCK));
  form.append("availability", "in_stock");
  form.append("specs", JSON.stringify(specs));

  for (const imgPath of imageFiles) {
    form.append("images", fs.createReadStream(imgPath), { filename: path.basename(imgPath) });
  }

  const response = await fetch(`${SITE_URL}/api/products`, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`);
  return JSON.parse(text);
}

// ─── API: обновить товар ───────────────────────────────────────────────────────

async function updateProduct(params: {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  price: number;
  description: string;
  specs: Record<string, string>;
  imageFiles: string[];
}): Promise<{ id: string; slug: string }> {
  const { id, name, slug, brandId, price, description, specs, imageFiles } = params;

  const form = new FormData();
  form.append("name", name);
  form.append("slug", slug);
  form.append("brandId", brandId);
  form.append("categoryId", CATEGORY_ID);
  form.append("price", String(price));
  form.append("description", description);
  form.append("inStock", String(DEFAULT_STOCK));
  form.append("availability", "in_stock");
  form.append("specs", JSON.stringify(specs));

  for (const imgPath of imageFiles) {
    form.append("images", fs.createReadStream(imgPath), { filename: path.basename(imgPath) });
  }

  const response = await fetch(`${SITE_URL}/api/products/${id}`, {
    method: "PATCH",
    body: form,
    headers: form.getHeaders(),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`);
  return JSON.parse(text);
}

// ─── API: удалить товар ────────────────────────────────────────────────────────

async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${SITE_URL}/api/products/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
}

// ─── Сохранение лога ───────────────────────────────────────────────────────────

function saveLog() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const logPath = path.join(process.cwd(), `import-log-${timestamp}.json`);

  const summary = {
    timestamp: new Date().toISOString(),
    mode: DRY_RUN ? "dry-run" : MODE,
    total: logEntries.length,
    created: logEntries.filter((e) => e.status === "created").length,
    updated: logEntries.filter((e) => e.status === "updated").length,
    skipped: logEntries.filter((e) => e.status === "skipped").length,
    failed: logEntries.filter((e) => e.status === "failed").length,
    dryRun: logEntries.filter((e) => e.status === "dry-run").length,
    entries: logEntries,
  };

  fs.writeFileSync(logPath, JSON.stringify(summary, null, 2), "utf-8");
  console.log(`\n📄  Лог сохранён: ${logPath}`);
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
  console.log(`⚙️   Режим: ${DRY_RUN ? "dry-run" : MODE}`);
  console.log(`🌐  Сайт: ${SITE_URL}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const folderPath = path.join(PRODUCTS_DIR, entry.name);
    const name = makeModelName(entry.name);
    const slug = makeSlug(entry.name);
    const brandId = detectBrandId(name);
    const brandName = detectBrandName(name);
    const files = fs.readdirSync(folderPath);

    // ── Картинки ──
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

    // ── сео.docx ──
    const ceoFile =
      files.find((f) => f.toLowerCase() === "ceo.docx") ??
      files.find((f) => f.toLowerCase() === "сео.docx") ??
      files.find((f) => /^ceo/i.test(f) && f.endsWith(".docx")) ??
      files.find((f) => /^сео/i.test(f) && f.endsWith(".docx"));

    let price = 0;
    let description = "";

    if (ceoFile) {
      try {
        const parsed = await parseCeoDocx(path.join(folderPath, ceoFile));
        price = parsed.price;
        description = parsed.description;
      } catch (err) {
        console.warn(`  ⚠️  Ошибка сео.docx: ${err}`);
      }
    }

    // ── specs ──
    const specsFile =
      files.find((f) => f.toLowerCase().includes("microsoft word") && f.endsWith(".docx")) ??
      files.find((f) => f.endsWith(".docx") && f.toLowerCase() !== "ceo.docx" && f.toLowerCase() !== "сео.docx");

    let specs: Record<string, string> = {};
    if (specsFile) {
      try {
        specs = await parseSpecsDocx(path.join(folderPath, specsFile));
      } catch (err) {
        console.warn(`  ⚠️  Ошибка specs docx: ${err}`);
      }
    }

    // ── Проверяем существование ──
    const existing = await checkExists(slug);
    const exists = !!existing;

    // ── Вывод ──
    const statusIcon = exists
      ? MODE === "skip" ? "⏭️ " : MODE === "update" ? "🔄" : "♻️ "
      : "🆕";

    console.log(`${statusIcon}  ${entry.name}`);
    console.log(`    бренд:   ${brandName}  |  slug: ${slug}`);
    console.log(`    цена:    ${price} ₽  |  фото: ${imageFiles.length} шт  |  specs: ${Object.keys(specs).length} строк`);

    if (exists) {
      const oldPrice = existing!.priceCents / 100;
      if (oldPrice !== price) {
        console.log(`    💰 Цена изменилась: ${oldPrice} ₽ → ${price} ₽`);
      } else {
        console.log(`    💰 Цена без изменений: ${price} ₽`);
      }
    }

    if (DRY_RUN) {
      if (exists) {
        const oldPrice = existing!.priceCents / 100;
        const priceChanged = oldPrice !== price;
        console.log(`    ⏭️   [dry-run] УЖЕ СУЩЕСТВУЕТ (id=${existing!.id})`);
        if (priceChanged) {
          console.log(`    💰  Цена изменится: ${oldPrice} ₽ → ${price} ₽`);
        } else {
          console.log(`    💰  Цена без изменений: ${price} ₽`);
        }
        console.log(`    ℹ️   При --mode update будет обновлён\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "skipped", productId: existing!.id, timestamp: new Date().toISOString(),
        });
        skipped++;
      } else {
        console.log(`    ✅  [dry-run] БУДЕТ СОЗДАН\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "dry-run", timestamp: new Date().toISOString(),
        });
        created++;
      }
      continue;
    }

    // ── Логика по режиму ──
    try {
      if (!exists) {
        // Товара нет — создаём всегда
        const result = await createProduct({ name, slug, brandId, price, description, specs, imageFiles });
        console.log(`    ✅  Создан: id=${result.id}\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "created", productId: result.id, timestamp: new Date().toISOString(),
        });
        created++;

      } else if (MODE === "skip") {
        // Товар есть — пропускаем
        console.log(`    ⏭️   Пропущен (уже существует, id=${existing!.id})\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "skipped", productId: existing!.id, timestamp: new Date().toISOString(),
        });
        skipped++;

      } else if (MODE === "update") {
        // Товар есть — обновляем
        const result = await updateProduct({ id: existing!.id, name, slug, brandId, price, description, specs, imageFiles });
        console.log(`    🔄  Обновлён: id=${result.id}\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "updated", productId: result.id, timestamp: new Date().toISOString(),
        });
        updated++;

      } else if (MODE === "force") {
        // Товар есть — удаляем и создаём заново
        await deleteProduct(existing!.id);
        const result = await createProduct({ name, slug, brandId, price, description, specs, imageFiles });
        console.log(`    ♻️   Пересоздан: id=${result.id}\n`);
        logEntries.push({
          folder: entry.name, slug, brand: brandName, price,
          images: imageFiles.length, specsCount: Object.keys(specs).length,
          status: "created", productId: result.id, timestamp: new Date().toISOString(),
        });
        created++;
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`    ❌  Ошибка: ${msg}\n`);
      logEntries.push({
        folder: entry.name, slug, brand: brandName, price,
        images: imageFiles.length, specsCount: Object.keys(specs).length,
        status: "failed", error: msg, timestamp: new Date().toISOString(),
      });
      failed++;
    }
  }

  // ── Итоговая таблица ──
  console.log("─".repeat(50));
  console.log(`📊  ИТОГ:`);
  console.log(`   🆕 Создано:    ${created}`);
  if (MODE === "update") console.log(`   🔄 Обновлено:  ${updated}`);
  console.log(`   ⏭️  Пропущено:  ${skipped}`);
  if (failed > 0) console.log(`   ❌ Ошибок:     ${failed}`);
  console.log(`   📦 Всего:      ${entries.length}`);
  console.log("─".repeat(50));

  // ── Список ошибок ──
  const failedEntries = logEntries.filter((e) => e.status === "failed");
  if (failedEntries.length > 0) {
    console.log("\n❌  Список ошибок:");
    failedEntries.forEach((e) => console.log(`   → ${e.folder}: ${e.error}`));
  }

  // ── Сохраняем лог ──
  saveLog();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});