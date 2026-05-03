// app/admin/posts/new/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function saveImagesFromForm(formData: FormData, prefix: string) {
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];
  if (!files?.length) return urls;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0 || !file.type.startsWith("image/")) continue;
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.type.split("/")[1] || "bin").toLowerCase();
    const safePrefix = (prefix || "post").replace(/[^a-z0-9-_]/gi, "");
    const filename = `${safePrefix}-${Date.now()}-${randomUUID()}.${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), buf);
    urls.push(`/uploads/${filename}`);
  }
  return urls;
}

async function createPost(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const contentMd = String(formData.get("contentMd") || "");
  const published = formData.get("published") === "on";

  const images = await saveImagesFromForm(formData, slug || "post");

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      contentMd,
      images,
      published,
      publishedAt: published ? new Date() : null,
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  if (published) revalidatePath(`/blog/${post.slug}`);

  redirect(`/admin/posts/${post.id}?saved=1`);
}

export default function NewPostPage() {
  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 pb-24">
      
      {/* Навигация */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/admin/posts" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            К списку статей
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Новая публикация</h1>
        </div>
      </div>

      <form action={createPost} encType="multipart/form-data">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* ЛЕВАЯ КОЛОНКА: Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-6">
              <div>
                <label className={labelClass}>Заголовок статьи</label>
                <input 
                  name="title" 
                  placeholder="Заголовок, который зацепит..."
                  className="w-full border-none bg-transparent p-0 text-3xl font-black placeholder:text-zinc-200 focus:ring-0" 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Текст (Markdown)</label>
                <textarea 
                  name="contentMd" 
                  placeholder="Начните писать свою историю..."
                  className="w-full min-h-[500px] rounded-3xl border border-zinc-100 bg-zinc-50/30 p-6 font-mono text-sm leading-relaxed outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all"
                />
                <div className="mt-4 rounded-2xl bg-zinc-50 p-4 flex gap-6 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5"><span className="text-zinc-900">#</span> Заголовок</div>
                  <div className="flex items-center gap-1.5"><span className="text-zinc-900">**</span>Жирный<span className="text-zinc-900">**</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-zinc-900">![]()</span> Картинка</div>
                  <div className="flex items-center gap-1.5"><span className="text-zinc-900">[ ]()</span> Ссылка</div>
                </div>
              </div>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Настройки */}
          <div className="space-y-6">
            
            {/* Блок: Статус публикации */}
            <section className="rounded-[2rem] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Публикация</h3>
              
              <div className="space-y-6">
                <label className="flex cursor-pointer items-center justify-between group">
                  <span className="text-sm font-bold">Статус: Live</span>
                  <div className="relative">
                    <input type="checkbox" name="published" className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-zinc-700 transition-colors peer-checked:bg-amber-500" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
                
                <button className="w-full rounded-full bg-amber-500 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98]">
                  Опубликовать
                </button>
              </div>
            </section>

            {/* Блок: Обложка */}
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className={labelClass}>Обложка журнала</h3>
              <div className="relative group">
                <input type="file" name="images" accept="image/*" multiple className="absolute inset-0 z-10 cursor-pointer opacity-0" />
                <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50 transition-colors group-hover:bg-zinc-100 group-hover:border-amber-400">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Загрузить фото</span>
                </div>
              </div>
            </section>

            {/* Блок: SEO / Meta */}
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <label className={labelClass}>URL Slug</label>
                <input name="slug" placeholder="kak-vybrat-chasy" className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Краткое описание (для превью)</label>
                <textarea 
                  name="excerpt" 
                  placeholder="О чем эта статья? Будет видно в списке всех новостей..."
                  className={`${inputClass} min-h-[120px] resize-none leading-relaxed`} 
                />
              </div>
            </section>

          </div>
        </div>
      </form>
    </div>
  );
}