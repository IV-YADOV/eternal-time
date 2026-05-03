// app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SpecsEditor from "@/components/admin/SpecsEditor";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import Link from "next/link";

function num(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

async function saveImagesFromForm(formData: FormData, prefix: string) {
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];
  if (!files || files.length === 0) return urls;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type?.startsWith?.("image/")) continue;

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.type.split("/")[1] || "bin").toLowerCase();
    const safePrefix = (prefix || "img").replace(/[^a-z0-9-_]/gi, "");
    const filename = `${safePrefix}-${Date.now()}-${randomUUID()}.${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), buf);
    urls.push(`/uploads/${filename}`);
  }
  return urls;
}

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const brandId = String(formData.get("brandId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const price = num(formData.get("price")) ?? 0;
  const description = String(formData.get("description") || "");

  const badgeRaw = (formData.get("badge") ?? "").toString().trim().toUpperCase();
  const badge =
    badgeRaw === "NEW" || badgeRaw === "SALE" || badgeRaw === "HIT" || badgeRaw === "LIMITED"
      ? (badgeRaw as "NEW" | "SALE" | "HIT" | "LIMITED")
      : undefined;

  let specs: Record<string, any> = {};
  try {
    const json = String(formData.get("specs") || "{}");
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object") specs = parsed;
  } catch {
    specs = {};
  }

  const availability = (formData.get("availability") || "in_stock").toString();
  if (availability === "in_stock" || availability === "preorder") {
    specs.availability = availability;
  }

  const gender = (formData.get("gender") || "").toString();
  if (["men", "women", "unisex"].includes(gender)) {
    specs.gender = gender;
  }

  const uploadedImages = await saveImagesFromForm(formData, slug);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      brandId,
      categoryId,
      description,
      specs,
      images: uploadedImages,
      badge,
      variants: {
        create: [
          {
            sku: `${slug}-base`,
            priceCents: Math.round(price * 100),
            currency: "RUB",
            attributes: { color: "black" },
            inStock: Number(formData.get("inStock") || 10),
          },
        ],
      },
    },
  });

  redirect(`/admin/products/${product.id}`);
}

export default async function NewProduct() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      
      {/* Навигация и заголовок */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/admin/products" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к товарам
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Новый товар</h1>
        </div>
      </div>

      <form action={createProduct} className="space-y-8" encType="multipart/form-data">
        
        {/* Секция 1: Основное */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">01</span>
            Базовая информация
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Полное название модели</label>
              <input name="name" className={inputClass} placeholder="Например: Casio G-Shock GA-2100-1A1" required />
            </div>
            
            <div>
              <label className={labelClass}>Slug (URL путь)</label>
              <input name="slug" className={inputClass} placeholder="ga-2100-1a1" required />
            </div>

            <div>
              <label className={labelClass}>Бейдж на витрине</label>
              <select name="badge" className={inputClass} defaultValue="">
                <option value="">Без бейджа</option>
                <option value="NEW">Новинка ✨</option>
                <option value="SALE">Скидка 🏷️</option>
                <option value="HIT">Хит продаж 🔥</option>
                <option value="LIMITED">Лимитированная серия 💎</option>
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Линейка бренда</label>
              <select name="brandId" className={inputClass} required>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Категория</label>
              <select name="categoryId" className={inputClass} required>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Секция 2: Цены и Склад */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">02</span>
            Коммерция
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>Цена (₽)</label>
              <input type="number" min={0} name="price" className={inputClass} defaultValue={0} />
            </div>
            
            <div>
              <label className={labelClass}>В наличии (шт)</label>
              <input type="number" min={0} name="inStock" className={inputClass} defaultValue={10} />
            </div>

            <div>
              <label className={labelClass}>Доступность</label>
              <select name="availability" className={inputClass} defaultValue="in_stock">
                <option value="in_stock">В наличии</option>
                <option value="preorder">Под заказ</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Пол</label>
              <select name="gender" className={inputClass} defaultValue="">
                <option value="">Не указан</option>
                <option value="men">Мужские</option>
                <option value="women">Женские</option>
                <option value="unisex">Унисекс</option>
              </select>
            </div>
          </div>
        </section>

        {/* Секция 3: Медиа */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">03</span>
            Контент и фото
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Изображения товара</label>
              <div className="relative group">
                <input 
                  type="file" 
                  name="images" 
                  accept="image/*" 
                  multiple 
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" 
                />
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-10 transition-colors group-hover:bg-zinc-50 group-hover:border-amber-400">
                  <svg className="mb-3 h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-bold text-zinc-900">Нажмите для загрузки или перетащите файлы</p>
                  <p className="mt-1 text-xs text-zinc-500">JPG, PNG, WebP до 10МБ (можно выбрать несколько)</p>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Технические характеристики (JSON)</label>
              <SpecsEditor name="specs" />
            </div>

            <div>
              <label className={labelClass}>Описание товара</label>
              <textarea 
                name="description" 
                placeholder="Расскажите о преимуществах модели..."
                className={`${inputClass} min-h-[160px] resize-none leading-relaxed py-4`} 
              />
            </div>
          </div>
        </section>

        {/* Кнопка сохранения */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <Link href="/admin/products" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
            Отменить
          </Link>
          <button className="flex h-14 items-center justify-center rounded-full bg-amber-500 px-10 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98]">
            Создать товар
          </button>
        </div>

      </form>
    </div>
  );
}