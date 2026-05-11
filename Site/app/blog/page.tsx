export const revalidate = 60;

// app/blog/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=1200&q=70` : safe;
}

function formatDate(d?: Date | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function createFallbackExcerpt(text: string, n = 120) {
  const cleanText = text.replace(/[#*`_>]/g, "").replace(/\s+/g, " ").trim();
  return cleanText.length > n ? cleanText.slice(0, n).trimEnd() + "…" : cleanText;
}

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      contentMd: true,
      images: true,
      createdAt: true,
      publishedAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-16">
      
      {/* Шапка страницы */}
      <header className="flex flex-col items-center space-y-4 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
          Журнал
        </p>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl leading-[1.1]">
          Истории и обзоры
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          Погрузитесь в мир часового искусства. Экспертные советы, новинки рынка и детальные разборы культовых моделей от команды EternalTime.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center">
          <p className="text-xl font-bold text-zinc-400">Статей пока нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const images = (p.images as string[]) || [];
            const firstImg = images[0] || "https://picsum.photos/800/800";
            const date = p.publishedAt ?? p.createdAt;
            const displayDescription = p.excerpt || createFallbackExcerpt(p.contentMd || "");

            return (
              <Link
                key={p.id}
                href={`/blog/${encodeURIComponent(p.slug)}`}
                className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-400/10 hover:border-zinc-200" /* ЕДИНЫЙ КОНТЕЙНЕР: Скругляем, добавляем белый фон, тень и обводку */
              >
                {/* Обложка (теперь внутри единого блока) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                  <img
                    src={buildImgSrc(firstImg)}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Контент: Пакет отступов p-8 sm:p-10 обьединяет всё внутри */}
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-5 border-b border-zinc-100 pb-5">
                    <time className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {formatDate(date)}
                    </time>
                    <span className="h-1 w-1 rounded-full bg-zinc-200" />
                  </div>

                  <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-zinc-900 group-hover:text-zinc-500 transition-colors line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-3">
                    {displayDescription}
                  </p>
                  
                  <div className="flex items-center text-xs font-black uppercase tracking-widest text-zinc-900 group-hover:text-zinc-500 transition-colors">
                    Читать полностью
                    <svg className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5-5 5" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}