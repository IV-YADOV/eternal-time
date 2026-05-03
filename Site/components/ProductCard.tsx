import Link from "next/link";
import Price from "./Price";

export default function ProductCard({
  product
}: {
  product: {
    id?: string;
    slug: string;
    name: string;
    images: string[];
    variants: { priceCents: number; currency: string }[];
    brand: { name: string };
    createdAt?: string | Date;
    badge?: "NEW" | "SALE" | "HIT" | "LIMITED" | null;
  };
}) {
  const image = product.images?.[0] || "https://picsum.photos/600/600";
  const minPrice = product.variants[0];

  const renderBadge = (badge?: string | null) => {
    if (!badge) return null;

    switch (badge) {
      case "HIT":
        return (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/30">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" clipRule="evenodd" />
            </svg>
            Хит
          </div>
        );
      case "NEW":
        return (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
            New
          </div>
        );
      case "SALE":
        return (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/30">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
            </svg>
            Sale
          </div>
        );
      case "LIMITED":
        return (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-indigo-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            Лимитка
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      href={`/watch/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-zinc-200 transition-all md:hover:-translate-y-1 md:hover:shadow-xl md:hover:shadow-zinc-200/50 md:hover:ring-zinc-300" /* Анимация карточки срабатывает только на ПК (md:hover) */
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 flex items-center justify-center">
  {renderBadge(product.badge)}

  <img
    src={`${image}?auto=format&fit=max&w=800&q=80`}
    alt={product.name}
    /* 1. mix-blend-multiply — магия удаления белого фона.
       2. Обязательно оставляем object-contain, чтобы не было искажений.
    */
    className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out md:group-hover:scale-105"
    loading="lazy"
  />
  
  {/* Градиент лучше убрать или сделать еле заметным, 
      так как blend-mode может конфликтовать с наложениями поверх */}
  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/[0.02] to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" />
</div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors md:group-hover:text-zinc-500">
              {product.brand?.name}
            </div>
            <div className="mt-1 text-sm font-bold leading-tight text-zinc-900 line-clamp-2 sm:text-base">
              {product.name}
            </div>
          </div>
          
          {/* На мобилке: стрелка видна статично (opacity-100, translate-x-0).
            На ПК: скрыта (md:opacity-0, md:-translate-x-2) и выезжает по ховеру.
          */}
          <div className="flex h-8 w-8 shrink-0 translate-x-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 opacity-100 transition-all duration-300 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:bg-zinc-900 md:group-hover:text-white md:group-hover:opacity-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        <div className="mt-auto pt-3 font-black tracking-tight text-zinc-900">
          <Price cents={minPrice.priceCents} currency={minPrice.currency} />
        </div>
      </div>
    </Link>
  );
}