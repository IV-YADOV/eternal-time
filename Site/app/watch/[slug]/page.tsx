// app/product/[slug]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Price from "@/components/Price";
import AddToCart from "@/components/AddToCart";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      category: true, // ← берём категорию (пол)
      variants: { orderBy: { id: "desc" } },
    },
  });

  if (!product) notFound();

  const base = product.variants.find((v) => v.sku?.endsWith("-base"));
  const v = base ?? product.variants[0] ?? null;

  const images = (product.images as string[]) ?? [];
  const firstImage = images[0] ?? "https://picsum.photos/1200/1200";

  const inStock = v?.inStock ?? 0;
  const currency = v?.currency ?? "RUB";
  const priceCents = v?.priceCents ?? 0;

  // ----- Доступность из specs -----
  const availabilityRaw = String((product.specs as any)?.availability ?? "").toLowerCase();
  const availability: "in_stock" | "preorder" | null =
    availabilityRaw === "in_stock" ? "in_stock" : availabilityRaw === "preorder" ? "preorder" : null;

  // ----- Пол из категории -----
  const catSlug = (product.category?.slug || "").toLowerCase();
  const catName = (product.category?.name || "").toLowerCase();

  // Пытаемся понять пол по slug/name категории
  let genderSchema: "male" | "female" | "unisex" | null = null;
  let genderLabel: string | null = null;

  if (/(^|[-_ ])men|муж/i.test(catSlug) || /муж/i.test(catName)) {
    genderSchema = "male";
    genderLabel = "Мужские";
  } else if (/(^|[-_ ])women|жен/i.test(catSlug) || /жен/i.test(catName)) {
    genderSchema = "female";
    genderLabel = "Женские";
  } else if (/uni|unisex|унис/i.test(catSlug) || /унис/i.test(catName)) {
    genderSchema = "unisex";
    genderLabel = "Унисекс";
  }

  // Показываем кнопку «Купить» только если явно «В наличии» (или есть остаток)
  const canBuy = (availability === "in_stock" && inStock > 0) || (availability == null && inStock > 0);

  const paragraphs =
    product.description
      ?.split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  const serviceHighlights = [
    { 
      title: "Доставка", 
      text: "5–12 дней по России и отслеживание в чате.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    { 
      title: "Гарантия", 
      text: "12 месяца на механизм и герметичность.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      title: "Комплектация", 
      text: "Оригинальная коробка, документы, визитка.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    },
  ];

  const specsEntries = Object.entries(product.specs as Record<string, any> ?? {})
    .filter(([k, val]) => {
      if (k === "gender" || k === "availability") return false;
      return val !== undefined && val !== null && String(val) !== "";
    })
    .map(([k, val]) => ({ key: k, value: val }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-12 lg:space-y-16">
      
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500">
        <Link href="/" className="transition-colors hover:text-zinc-400">
          Главная
        </Link>
        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/catalog" className="transition-colors hover:text-zinc-400">
          Каталог
        </Link>
        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {product.brand ? (
          <>
            <Link href={`/catalog?brand=${encodeURIComponent(product.brand.slug)}`} className="transition-colors hover:text-zinc-400">
              {product.brand.name}
            </Link>
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        ) : null}
        <span className="truncate text-zinc-800">{product.name}</span>
      </nav>

      {/* Верхняя часть: Галерея + Информация */}
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:grid-cols-[1.2fr_0.8fr]">
        
        {/* Галерея (Слева) */}
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 h-fit">
          <ProductGallery images={images} />
        </div>

        {/* Информация (Справа - залипает при скролле) */}
        <div className="flex flex-col lg:sticky lg:top-24 lg:h-max">
          <div className="space-y-6">
            
            {/* Надбровная часть (Бренд + Пол) */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                {product.brand?.name || "Бренд"}
              </span>
              {genderLabel && (
                <>
                  <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                  <span className="text-sm font-medium text-zinc-500">
                    {genderLabel}
                  </span>
                </>
              )}
            </div>

            {/* Название */}
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:leading-[1.1]">
              {product.name}
            </h1>

            {/* Блок цены и кнопки покупки */}
            {v ? (
              <div className="mt-8 space-y-8 rounded-[2rem] bg-zinc-50 p-6 sm:p-8 border border-zinc-100">
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold tracking-tight text-zinc-900">
                      <Price cents={priceCents} currency={currency} />
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {product.badge === "NEW" ? "New" : product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Статус наличия */}
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200/50">
                  <span className="relative flex h-3 w-3">
                    {inStock > 0 || availability === "in_stock" ? (
                      <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                    )}
                  </span>
                  <p className="text-sm font-medium text-zinc-700">
                    {inStock > 0
                      ? `В наличии.`
                      : "Под заказ — привезём за 7–12 дней"}
                  </p>
                </div>

                {/* Кнопка в корзину */}
                <div className="pt-2">
                  {canBuy && v ? (
                    <AddToCart variantId={v.id} />
                  ) : (
                    <button disabled className="flex w-full items-center justify-center rounded-full bg-zinc-200 py-4 text-base font-semibold text-zinc-500 cursor-not-allowed transition-all">
                      Недоступно к заказу
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                Варианты товара не заданы
              </div>
            )}

            {/* Преимущества сервиса */}
            <div className="mt-10 space-y-6 pt-6">
              {serviceHighlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/50">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      {(paragraphs.length > 0 || specsEntries.length > 0) && (
        <hr className="border-zinc-200" />
      )}

      {/* Нижняя часть: Описание и Характеристики */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        
        {/* История / Описание */}
        {paragraphs.length > 0 && (
          <section className={`space-y-6 ${specsEntries.length > 0 ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}`}>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">О модели</h2>
            <div className="space-y-5 text-lg leading-relaxed text-zinc-600">
              {paragraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          </section>
        )}

        {/* Характеристики */}
        {specsEntries.length > 0 && (
          <section className={`space-y-6 ${paragraphs.length > 0 ? "lg:col-span-5" : "lg:col-span-8 lg:col-start-3"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Характеристики</h2>
            </div>
            
            <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
              <dl className="divide-y divide-zinc-100">
                {specsEntries.map(({ key, value }, index) => (
                  <div 
                    key={key} 
                    className={`flex justify-between px-6 py-4 transition-colors hover:bg-zinc-50 ${index % 2 === 0 ? 'bg-zinc-50/50' : 'bg-white'}`}
                  >
                    <dt className="w-1/2 text-sm font-medium text-zinc-500">{formatSpecKey(key)}</dt>
                    <dd className="w-1/2 text-right text-sm font-semibold text-zinc-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}
      </div>

      {/* JSON-LD для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            brand: product.brand?.name,
            image: firstImage,
            description: product.description,
            ...(genderSchema ? { audience: { "@type": "PeopleAudience", suggestedGender: genderSchema } } : {}),
            offers:
              v && {
                "@type": "Offer",
                priceCurrency: currency,
                price: (priceCents / 100).toFixed(2),
                availability:
                  availability === "preorder"
                    ? "https://schema.org/PreOrder"
                    : availability === "in_stock" || inStock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
          }),
        }}
      />
    </div>
  );
}

/** Подписи для характеристик */
function formatSpecKey(key: string) {
  const map: Record<string, string> = {
    mechanism: "Механизм",
    waterResistanceATM: "Водозащита (ATM)",
    glass: "Стекло",
    caseMaterial: "Материал корпуса",
    diameterMM: "Диаметр (мм)",
    thicknessMM: "Толщина (мм)",
    weightG: "Вес (г)",
    powerReserveH: "Запас хода (ч)",
  };
  return map[key] ?? key;
}