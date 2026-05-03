// app/admin/posts/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const Page = async () => {
  // Параллельный сбор статистики
  const [posts, stats] = await Promise.all([
    prisma.post.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.post.aggregate({
      _count: { id: true },
    }),
  ]);

  const liveCount = posts.filter(p => p.published).length;
  const draftCount = posts.length - liveCount;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-20 text-zinc-900">
      
      {/* 1. ХЕДЕР И ДАШБОРД */}
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Редакция</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Управление контентом и новостной лентой EternalTick</p>
          </div>
          <Link 
            href="/admin/posts/new" 
            className="inline-flex h-14 items-center justify-center rounded-full bg-zinc-900 px-10 text-sm font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-amber-600 active:scale-95"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Создать статью
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {/* Всего статей */}
          <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Общий архив</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter">
              {stats._count.id} <span className="text-lg text-zinc-500 uppercase">Постов</span>
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-amber-500">EternalTick Press</p>
          </div>

          {/* Опубликовано */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">В эфире</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {liveCount} <span className="text-lg text-zinc-300">Live</span>
            </h2>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Доступно читателям
            </div>
          </div>

          {/* Черновики */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">В работе</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {draftCount} <span className="text-lg text-zinc-300">Drafts</span>
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-zinc-400">Требуют доработки</p>
          </div>
        </div>
      </div>

      {/* 2. ТАБЛИЦА СТАТЕЙ */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Список публикаций</h3>
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  <th className="px-8 py-5">Заголовок / Slug</th>
                  <th className="px-8 py-5">Статус</th>
                  <th className="px-8 py-5">График</th>
                  <th className="px-8 py-5 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-zinc-400 font-medium italic text-sm">
                      Публикаций пока нет
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id} className="group transition-colors hover:bg-zinc-50/30">
                      <td className="px-8 py-6">
                        <div className="max-w-md space-y-1">
                          <Link 
                            href={`/admin/posts/${p.id}`} 
                            className="block font-black text-lg text-zinc-900 hover:text-amber-600 transition-all uppercase tracking-tight line-clamp-1"
                          >
                            {p.title}
                          </Link>
                          <code className="text-[10px] font-bold text-amber-600/60 uppercase tracking-tighter">
                            /{p.slug}
                          </code>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${
                          p.published 
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                            : "bg-zinc-100 text-zinc-400 ring-zinc-500/10"
                        }`}>
                          {p.published ? "Live" : "Draft"}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-zinc-900 uppercase">
                            {p.publishedAt ? formatDate(p.publishedAt) : "—"}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Создана: {formatDate(p.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            href={`/admin/posts/${p.id}`} 
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 px-5 text-[10px] font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white active:scale-95"
                          >
                            Edit
                          </Link>
                          
                          <Link 
                            href={`/blog/${p.slug}`} 
                            target="_blank"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-all hover:bg-zinc-100 hover:text-zinc-900"
                            title="На сайт"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-10 border-t border-zinc-100 flex items-center justify-between">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">EternalTick Content Engine v.2.1</p>
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Articles: {posts.length}</span>
         </div>
      </footer>
    </div>
  );
};

export default Page;