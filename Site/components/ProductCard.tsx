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
  const image = product.images?.[0] || "";
  const minPrice = product.variants[0];

  const renderBadge = (badge?: string | null) => {
    if (!badge) return null;
    const styles: Record<string, { bg: string; shadow: string; label: string }> = {
      HIT:     { bg: "bg-amber-500",   shadow: "shadow-amber-500/30",   label: "Хит" },
      NEW:     { bg: "bg-emerald-500", shadow: "shadow-emerald-500/30", label: "New" },
      SALE:    { bg: "bg-rose-500",    shadow: "shadow-rose-500/30",    label: "Sale" },
      LIMITED: { bg: "bg-indigo-500",  shadow: "shadow-indigo-500/30",  label: "Лимитка" },
    };
    const s = styles[badge];
    if (!s) return null;
    return (
      <div className={`absolute left-3 top-3 z-10 rounded-full ${s.bg} px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${s.shadow}`}>
        {s.label}
      </div>
    );
  };

  return (
    <Link
      href={`/watch/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition-all md:hover:-translate-y-1 md:hover:shadow-xl md:hover:ring-zinc-300"
      
    >
      <div className="relative w-full bg-zinc-50" style={{ paddingBottom: "100%" }}>
        {renderBadge(product.badge)}
        {image && (
          <img
            src={`${image}?auto=format&fit=max&w=800&q=80`}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5 mix-blend-multiply transition-transform duration-500 md:group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {product.brand?.name}
        </div>
        <div className="mt-1 text-xs font-bold leading-tight text-zinc-900 line-clamp-2 sm:text-sm break-all" style={{ minHeight: "2.5rem" }}>
          {product.name}
        </div>
        <div className="mt-auto pt-3 font-black tracking-tight text-zinc-900">
          <Price cents={minPrice.priceCents} currency={minPrice.currency} />
        </div>
      </div>
    </Link>
  );
}
