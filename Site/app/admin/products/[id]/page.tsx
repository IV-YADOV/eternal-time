// app/admin/products/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import SavedToast from "@/components/SavedToast";
import { revalidatePath } from "next/cache";
import SpecsEditor from "@/components/admin/SpecsEditor";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ImageManager from "@/components/admin/ImageManager"; // <--- Импортируем новый компонент

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
    const safePrefix = prefix.replace(/[^a-z0-9-_]/gi, "");
    const filename = `${safePrefix || "img"}-${Date.now()}-${randomUUID()}.${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), buf);
    urls.push(`/uploads/${filename}`);
  }
  return urls;
}

async function tryDeleteFiles(paths: string[]) {
  for (const p of paths) {
    if (!p.startsWith("/uploads/")) continue;
    const abs = path.join(process.cwd(), "public", p);
    try {
      await fs.unlink(abs);
    } catch {}
  }
}

async function updateProduct(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const variantId = String(formData.get("variantId") || "");
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const brandId = String(formData.get("brandId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const price = num(formData.get("price")) ?? 0;
  const inStock = num(formData.get("inStock")) ?? 0;
  const description = String(formData.get("description") || "");

  const badgeRaw = (formData.get("badge") ?? "").toString().trim().toUpperCase();
  const badge =
    badgeRaw === "NEW" || badgeRaw === "SALE" || badgeRaw === "HIT" || badgeRaw === "LIMITED"
      ? (badgeRaw as "NEW" | "SALE" | "HIT" | "LIMITED")
      : null;

  const availability = (formData.get("availability") || "").toString();
  const gender = (formData.get("gender") || "").toString();

  const current = await prisma.product.findUnique({
    where: { id },
    select: { images: true, slug: true, specs: true },
  });
  if (!current) throw new Error("Product not found");

  const currentImages: string[] = Array.isArray(current.images) ? (current.images as string[]) : [];
  const currentSpecs: Record<string, any> = (current.specs ?? {}) as Record<string, any>;

  let editorSpecs: Record<string, any> = {};
  try {
    const json = String(formData.get("specs") || "{}");
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object") editorSpecs = parsed;
  } catch {
    editorSpecs = {};
  }

  const nextSpecs: Record<string, any> = { ...currentSpecs, ...editorSpecs };
  if (availability === "in_stock" || availability === "preorder") {
    nextSpecs.availability = availability;
  } else {
    delete nextSpecs.availability;
  }
  if (["men", "women", "unisex"].includes(gender)) {
    nextSpecs.gender = gender;
  } else {
    delete nextSpecs.gender;
  }

  // --- ИЗМЕНЕНО: Обработка сохраненного порядка фотографий ---
  const keptImages = formData.getAll("keptImages") as string[]; 
  const removeList = currentImages.filter((src) => !keptImages.includes(src));
  
  const uploadedImages = await saveImagesFromForm(formData, slug || current.slug);
  
  // Новый порядок = оставшиеся картинки в заданном порядке + новые загруженные (в конец)
  const nextImages = [...keptImages, ...uploadedImages];

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      brandId,
      categoryId,
      description,
      images: nextImages,
      specs: nextSpecs,
      badge,
    },
  });

  const removedFiles = removeList.filter((src) => src.startsWith("/uploads/"));
  if (removedFiles.length) await tryDeleteFiles(removedFiles);

  if (variantId) {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { priceCents: Math.round(price * 100), inStock },
    });
  }

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);

  redirect(`/admin/products/${id}?saved=1`);
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));

  const variants = await prisma.productVariant.findMany({
    where: { productId: id },
    select: { id: true },
  });
  const variantIds = variants.map((v) => v.id);

  const hasOrders = variantIds.length > 0
    ? (await prisma.orderItem.count({ where: { variantId: { in: variantIds } } })) > 0
    : false;

  if (hasOrders) {
    await prisma.product.update({
      where: { id },
      data: { isArchived: true },
    });
    await prisma.productVariant.updateMany({
      where: { productId: id },
      data: { inStock: 0 },
    });
    
    revalidatePath("/admin/products");
    return redirect(`/admin/products/${id}?result=archived`);
  }

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ 
      where: { variantId: { in: variantIds } } 
    }),
    prisma.productVariant.deleteMany({ 
      where: { productId: id } 
    }),
    prisma.product.delete({ 
      where: { id } 
    }),
  ]);

  const current = await prisma.product.findUnique({ 
    where: { id }, 
    select: { images: true } 
  });
  const imgs = (current?.images as string[]) ?? [];
  if (imgs.length) await tryDeleteFiles(imgs);

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/catalog");
  
  return redirect("/admin/products?result=deleted");
}

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { saved?: string; result?: "archived" | "deleted" };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { brand: true, category: true, variants: true },
  });
  if (!product) notFound();

  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const base = product.variants.find((vv) => vv.sku?.endsWith("-base"));
  const v = base ?? product.variants[0];

  const imgs = (product.images as string[]) || [];
  const specs = (product.specs ?? {}) as Record<string, any>;
  const availability = (specs.availability as string) || "";
  const gender = (specs.gender as string) || "";

  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      
      {/* Шапка и уведомления */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin/products" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
              <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              К списку товаров
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Редактирование</h1>
          </div>
        </div>

        {searchParams?.saved === "1" && <SavedToast message="Изменения сохранены" />}
        
        {searchParams?.result === "archived" && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm font-medium text-amber-800 ring-1 ring-amber-200/50">
            ⚠️ Товар перенесен в архив, так как по нему есть активные заказы. Он скрыт с витрины.
          </div>
        )}
      </div>

      <form action={updateProduct} className="space-y-8" encType="multipart/form-data">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="variantId" value={v?.id ?? ""} />

        {/* Секция 1: База */}
        <section className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">01</span>
            Основная информация
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Название модели</label>
              <input name="name" defaultValue={product.name} className={inputClass} required />
            </div>
            
            <div>
              <label className={labelClass}>Slug (ЧПУ)</label>
              <input name="slug" defaultValue={product.slug} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Бейдж</label>
              <select name="badge" className={inputClass} defaultValue={(product as any).badge ?? ""}>
                <option value="">Без бейджа</option>
                <option value="NEW">Новинка ✨</option>
                <option value="SALE">Скидка 🏷️</option>
                <option value="HIT">Хит 🔥</option>
                <option value="LIMITED">Лимит 💎</option>
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Линейка</label>
              <select name="brandId" className={inputClass} defaultValue={product.brandId}>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Категория</label>
              <select name="categoryId" className={inputClass} defaultValue={product.categoryId}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Секция 2: Цены */}
        <section className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">02</span>
            Склад и цены
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>Цена (₽)</label>
              <input type="number" min={0} name="price" className={inputClass} defaultValue={v ? v.priceCents / 100 : 0} />
            </div>
            
            <div>
              <label className={labelClass}>Остаток (шт)</label>
              <input type="number" min={0} name="inStock" className={inputClass} defaultValue={v?.inStock ?? 0} />
            </div>

            <div>
              <label className={labelClass}>Доступность</label>
              <select name="availability" className={inputClass} defaultValue={availability}>
                <option value="">Не указано</option>
                <option value="in_stock">В наличии</option>
                <option value="preorder">Под заказ</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Пол</label>
              <select name="gender" className={inputClass} defaultValue={gender}>
                <option value="">Не указан</option>
                <option value="men">Мужские</option>
                <option value="women">Женские</option>
                <option value="unisex">Унисекс</option>
              </select>
            </div>
          </div>
        </section>

        {/* Секция 3: Фото */}
        <section className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">03</span>
            Галерея
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Текущие изображения (наведите для управления)</label>
              
              {/* ИЗМЕНЕНО: Используем новый клиентский компонент для сортировки */}
              <ImageManager initialImages={imgs} />

            </div>

            <div>
              <label className={labelClass}>Добавить новые фото</label>
              <div className="group relative">
                <input type="file" name="images" accept="image/*" multiple className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-8 transition-colors group-hover:border-amber-400 group-hover:bg-zinc-50">
                  <svg className="mb-2 h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <p className="text-xs font-bold text-zinc-500">Загрузить новые файлы</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Секция 4: Детали */}
        <section className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">04</span>
            Характеристики и описание
          </h2>
          <div className="space-y-6">
            <SpecsEditor name="specs" initial={specs} />
            <div>
              <label className={labelClass}>Описание</label>
              <textarea name="description" defaultValue={product.description} className={`${inputClass} min-h-[160px] resize-none py-4 leading-relaxed`} />
            </div>
          </div>
        </section>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between border-t border-zinc-100 pb-20 pt-10">
          <DeleteProductButton onDelete={deleteProduct} id={product.id} />

          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-sm font-bold text-zinc-500 hover:text-zinc-900">
              Отмена
            </Link>
            <button className="flex h-14 items-center justify-center rounded-full bg-amber-500 px-10 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98]">
              Сохранить изменения
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}