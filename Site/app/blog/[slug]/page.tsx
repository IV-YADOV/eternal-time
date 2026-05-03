// app/blog/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown"; // Импортируем парсер

export const dynamic = "force-dynamic";

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=1600&q=75` : safe;
}

function formatDate(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) notFound();

  const images = (Array.isArray(post.images) ? (post.images as string[]) : []) || [];
  const cover = images[0];
  const date = post.publishedAt ?? post.createdAt;

  return (
    <article className="mx-auto max-w-[840px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-12">
      
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
        <Link href="/" className="transition-colors hover:text-amber-600">Главная</Link>
        <span className="text-zinc-300">/</span>
        <Link href="/blog" className="transition-colors hover:text-amber-600">Журнал</Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-800 line-clamp-1">{post.title}</span>
      </nav>

      {/* Заголовок */}
      <header className="space-y-6 text-center">
        <time className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
          {formatDate(date)}
        </time>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          {post.title}
        </h1>
      </header>

      {/* Обложка (теперь растягивается идеально) */}
      {cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-2xl ring-1 ring-zinc-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildImgSrc(cover)}
            alt={post.title}
            className="h-full w-full object-cover object-center" // Ключевые классы для растягивания
          />
        </div>
      )}

      {/* Контент статьи (Markdown) */}
      <div className="prose prose-lg prose-zinc mx-auto max-w-none 
        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-900
        prose-p:leading-relaxed prose-p:text-zinc-600
        prose-a:font-bold prose-a:text-amber-600 prose-a:no-underline hover:prose-a:text-amber-700
        prose-strong:text-zinc-900 prose-strong:font-bold
        prose-img:rounded-[2rem] prose-img:shadow-lg
        prose-ul:list-disc prose-ol:list-decimal">
        
        {/* Рендерим маркдаун через компонент */}
        <ReactMarkdown>{post.contentMd || ""}</ReactMarkdown>
      </div>

      {/* Подвал статьи */}
      <footer className="pt-12 border-t border-zinc-100 flex flex-col items-center gap-6">
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest text-center">
          Спасибо за чтение <br/> 
          <span className="text-zinc-900 font-black">EternalTime Press</span>
        </p>
        <Link 
          href="/blog" 
          className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-100 px-8 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-200"
        >
          ← Назад в журнал
        </Link>
      </footer>

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            image: cover,
            datePublished: (date ?? new Date()).toISOString(),
            author: { "@type": "Organization", name: "EternalTime" },
          }),
        }}
      />
    </article>
  );
}