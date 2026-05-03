// app/admin/posts/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import SavedToast from "@/components/SavedToast";

function stripQuery(u: string) {
  try { return new URL(u, "http://x").pathname.replace(/^\/x/, "") || u; } catch { return u; }
}

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

async function tryDeleteFiles(paths: string[]) {
  for (const p of paths) {
    if (!p.startsWith("/uploads/")) continue;
    const abs = path.join(process.cwd(), "public", p);
    try { await fs.unlink(abs); } catch {}
  }
}

async function updatePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const contentMd = String(formData.get("contentMd") || "");
  const wantPublish = formData.get("published") === "on";

  const current = await prisma.post.findUnique({
    where: { id },
    select: { slug: true, images: true, published: true, publishedAt: true },
  });
  if (!current) throw new Error("Post not found");

  const currentImages: string[] = Array.isArray(current.images) ? (current.images as string[]) : [];
  const removeList = (formData.getAll("removeImages") as string[]).map(stripQuery);

  const keep = currentImages.filter((u) => !removeList.includes(u));
  const uploaded = await saveImagesFromForm(formData, slug || current.slug);
  const images = [...keep, ...uploaded];

  const becamePublished = wantPublish && !current.published;
  const becameDraft = !wantPublish && current.published;

  await prisma.post.update({
    where: { id },
    data: {
      title, slug, excerpt, contentMd,
      images,
      published: wantPublish,
      publishedAt: becamePublished ? new Date() : (becameDraft ? null : current.publishedAt),
    },
  });

  await tryDeleteFiles(removeList);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${id}?saved=1`);
}

async function deletePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const p = await prisma.post.findUnique({ where: { id }, select: { slug: true, images: true } });
  if (!p) return redirect("/admin/posts");

  await prisma.post.delete({ where: { id } });
  await tryDeleteFiles(((p.images as string[]) ?? []).filter(Boolean));

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts?deleted=1");
}

export default async function EditPostPage({
  params,
  searchParams,
}: { params: { id: string }, searchParams?: { saved?: string }}) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const imgs: string[] = Array.isArray(post.images) ? (post.images as string[]) : [];
  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 pb-24">
      
      {/* Шапка и Уведомления */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin/posts" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
              <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              К списку статей
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Редактирование</h1>
          </div>
        </div>
        {searchParams?.saved === "1" && <SavedToast message="Статья обновлена" />}
      </div>

      <form action={updatePost} encType="multipart/form-data">
        <input type="hidden" name="id" value={post.id} />

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* ЛЕВАЯ КОЛОНКА: Контент */}
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-6">
              <div>
                <label className={labelClass}>Заголовок статьи</label>
                <input 
                  name="title" 
                  defaultValue={post.title}
                  className="w-full border-none bg-transparent p-0 text-3xl font-black placeholder:text-zinc-200 focus:ring-0" 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Текст (Markdown)</label>
                <textarea 
                  name="contentMd" 
                  defaultValue={post.contentMd || ""}
                  className="w-full min-h-[600px] rounded-3xl border border-zinc-100 bg-zinc-50/30 p-6 font-mono text-sm leading-relaxed outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Настройки и Галерея */}
          <div className="space-y-6">
            
            {/* Блок: Публикация */}
            <section className="rounded-[2rem] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Публикация</h3>
              <div className="space-y-6">
                <label className="flex cursor-pointer items-center justify-between group">
                  <span className="text-sm font-bold">Статус: Live</span>
                  <div className="relative">
                    <input type="checkbox" name="published" className="peer sr-only" defaultChecked={post.published} />
                    <div className="h-6 w-11 rounded-full bg-zinc-700 transition-colors peer-checked:bg-amber-500" />
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
                
                <button className="w-full rounded-full bg-amber-500 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98]">
                  Сохранить
                </button>
              </div>
            </section>

            {/* Блок: Галерея (с удалением) */}
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className={labelClass}>Галерея статьи</h3>
              
              {imgs.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imgs.map((src, i) => (
                    <label key={src + i} className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-200 transition-all hover:ring-red-400">
                      <input type="checkbox" name="removeImages" value={src} className="peer sr-only" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover transition-all duration-300 peer-checked:opacity-20 peer-checked:grayscale" />
                      <div className="absolute inset-0 hidden items-center justify-center bg-red-50 peer-checked:flex">
                        <span className="text-[10px] font-black uppercase text-red-600">Удалить</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="relative group">
                <input type="file" name="images" accept="image/*" multiple className="absolute inset-0 z-10 cursor-pointer opacity-0" />
                <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50 transition-colors group-hover:bg-zinc-100 group-hover:border-amber-400">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Добавить фото</span>
                </div>
              </div>
            </section>

            {/* Блок: SEO */}
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <label className={labelClass}>URL Slug</label>
                <input name="slug" defaultValue={post.slug} className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Краткое описание</label>
                <textarea 
                  name="excerpt" 
                  defaultValue={post.excerpt || ""}
                  className={`${inputClass} min-h-[120px] resize-none leading-relaxed`} 
                />
              </div>
            </section>

            {/* Опасная зона */}
            <div className="flex justify-center pt-4">
              <DeletePostButton onDelete={deletePost} id={post.id} />
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}