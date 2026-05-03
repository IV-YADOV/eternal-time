// app/catalog/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Prisma, ProductBadge } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PER_PAGE = 9;

type PricePreset = "budget" | "middle" | "premium";

type SearchParams = {
  brand?: string;
  category?: string;
  badge?: ProductBadge;
  pricePreset?: PricePreset;
  min?: string;
  max?: string;
  q?: string;
  stock?: "1";
  new?: "1";
  sort?: "price_asc" | "price_desc" | "new" | "default";
  page?: string;
};

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; variants: true };
}>;

const pricePresetMap: Record<PricePreset, { label: string; min?: number; max?: number }> = {
  budget: { label: "До 5 000 ₽", max: 5000 },
  middle: { label: "5 000 — 20 000 ₽", min: 5000, max: 20000 },
  premium: { label: "От 20 000 ₽", min: 20000 },
};

export default async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1") || 1);

  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const pricePreset = isPricePreset(searchParams.pricePreset) ? searchParams.pricePreset : undefined;

  const where: Prisma.ProductWhereInput = { isArchived: false };

  if (searchParams.brand) {
    const brand = await prisma.brand.findUnique({ where: { slug: searchParams.brand } });
    if (brand) where.brandId = brand.id;
  }

  if (searchParams.category) {
    const category = await prisma.category.findUnique({ where: { slug: searchParams.category } });
    if (category) where.categoryId = category.id;
  }

  if (searchParams.badge && ["NEW", "SALE", "HIT", "LIMITED"].includes(searchParams.badge)) {
    where.badge = searchParams.badge;
  }

  let minRub = searchParams.min ? Math.max(0, Math.floor(Number(searchParams.min))) : undefined;
  let maxRub = searchParams.max ? Math.max(0, Math.floor(Number(searchParams.max))) : undefined;

  if (!searchParams.min && !searchParams.max && pricePreset) {
    minRub = pricePresetMap[pricePreset].min;
    maxRub = pricePresetMap[pricePreset].max;
  }

  if (minRub !== undefined || maxRub !== undefined) {
    const priceFilter: Prisma.IntFilter = {};
    if (minRub !== undefined) priceFilter.gte = minRub * 100;
    if (maxRub !== undefined) priceFilter.lte = maxRub * 100;
    where.variants = { some: { priceCents: priceFilter } };
  }

  if (searchParams.stock === "1") {
    where.AND = [...(where.AND as any[] ?? []), { variants: { some: { inStock: { gt: 0 } } } }];
  }

  if (searchParams.new === "1") {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    where.createdAt = { gte: since };
  }

  if (searchParams.q && searchParams.q.trim().length > 0) {
    const q = searchParams.q.trim();
    where.AND = [
      ...(where.AND as any[] ?? []),
      {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (searchParams.sort === "new" || !searchParams.sort || searchParams.sort === "default") {
    orderBy = { createdAt: "desc" };
  }

  // Общее количество для пагинации
  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const productsRaw = await prisma.product.findMany({
    where,
    include: { brand: true, variants: { orderBy: { id: "desc" } } },
    orderBy,
    take: PER_PAGE,
    skip: (safePage - 1) * PER_PAGE,
  });

  const minPrice = (p: { variants: { priceCents: number }[] }) =>
    p.variants.length ? Math.min(...p.variants.map((v) => v.priceCents)) : Number.POSITIVE_INFINITY;

  let sorted = [...productsRaw];
  if (searchParams.sort === "price_asc") {
    sorted.sort((a, b) => minPrice(a) - minPrice(b));
  } else if (searchParams.sort === "price_desc") {
    sorted.sort((a, b) => minPrice(b) - minPrice(a));
  }

  const products: ProductWithRelations[] = sorted.map((p) => {
    const base = p.variants.find((v) => v.sku?.endsWith("-base"));
    if (!base) return p as ProductWithRelations;
    return { ...p, variants: [base, ...p.variants.filter((v) => v.id !== base.id)] } as ProductWithRelations;
  });

  // --- АКТИВНЫЕ ФИЛЬТРЫ ---
  const buildUrlWithout = (...keys: (keyof SearchParams)[]) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value) return;
      if (keys.includes(key as keyof SearchParams)) return;
      params.set(key, value as string);
    });
    // При сбросе фильтра сбрасываем страницу
    params.delete("page");
    const query = params.toString();
    return `/catalog${query ? `?${query}` : ""}`;
  };

  // Строим URL для страницы пагинации (сохраняя все фильтры)
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value || key === "page") return;
      params.set(key, value as string);
    });
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return `/catalog${query ? `?${query}` : ""}`;
  };

  const activeFilters: { label: string; href: string }[] = [];
  if (searchParams.q) activeFilters.push({ label: `Поиск: ${searchParams.q}`, href: buildUrlWithout("q") });
  if (searchParams.brand) {
    const brandLabel = brands.find((b) => b.slug === searchParams.brand)?.name ?? searchParams.brand;
    activeFilters.push({ label: brandLabel, href: buildUrlWithout("brand") });
  }
  if (searchParams.category) {
    const categoryLabel = categories.find((c) => c.slug === searchParams.category)?.name ?? searchParams.category;
    activeFilters.push({ label: categoryLabel, href: buildUrlWithout("category") });
  }
  if (searchParams.badge) activeFilters.push({ label: searchParams.badge, href: buildUrlWithout("badge") });
  if (pricePreset) activeFilters.push({ label: pricePresetMap[pricePreset].label, href: buildUrlWithout("pricePreset") });
  if (searchParams.min) activeFilters.push({ label: `От ${Number(searchParams.min).toLocaleString("ru-RU")} ₽`, href: buildUrlWithout("min") });
  if (searchParams.max) activeFilters.push({ label: `До ${Number(searchParams.max).toLocaleString("ru-RU")} ₽`, href: buildUrlWithout("max") });
  if (searchParams.stock === "1") activeFilters.push({ label: "В наличии", href: buildUrlWithout("stock") });
  if (searchParams.new === "1") activeFilters.push({ label: "Новинки", href: buildUrlWithout("new") });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

      {/* Шапка раздела */}
      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-zinc-950 px-6 py-12 text-center shadow-2xl sm:mb-12 sm:px-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <div className="h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute -right-20 top-0 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Каталог</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Часы на любой случай
          </h1>
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            Используйте удобные фильтры, чтобы найти идеальную модель — от бескомпромиссных спортивных хронографов до неувядающей классики.
          </p>
        </div>
      </section>

      {/* Мобильные фильтры */}
      <details
        className="group sticky top-4 z-30 mb-8 rounded-[2rem] border border-zinc-200 bg-white/95 p-2 shadow-sm backdrop-blur-md lg:hidden"
        {...(hasAnyFilter(searchParams) ? { open: true } : {})}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2 font-semibold text-zinc-900">
          <span className="flex items-center gap-3">
            <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Фильтры и сортировка
          </span>
          <svg className="h-5 w-5 transform text-zinc-400 transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="max-h-[70vh] overflow-y-auto px-4 pb-4 pt-6">
          <FilterForm brands={brands} categories={categories} searchParams={searchParams} pricePreset={pricePreset} mobile />
        </div>
      </details>

      {/* Активные фильтры */}
      {activeFilters.length > 0 && (
        <div className="scrollbar-hide mb-8 flex snap-x items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:pb-0">
          <span className="shrink-0 pl-1 pr-2 text-sm font-medium text-zinc-500">Выбрано:</span>
          {activeFilters.map((filter) => (
            <Link
              key={filter.label}
              href={filter.href}
              className="group flex shrink-0 snap-start items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span>{filter.label}</span>
              <svg className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </Link>
          ))}
          <Link href="/catalog" className="shrink-0 pl-3 text-sm font-semibold text-zinc-500 transition-colors hover:text-amber-600">
            Сбросить всё
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">

        {/* Десктоп фильтры */}
        <aside className="sticky top-24 hidden h-max lg:block">
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900">Фильтры</h2>
            <FilterForm brands={brands} categories={categories} searchParams={searchParams} pricePreset={pricePreset} />
          </div>
        </aside>

        {/* Товары */}
        <div className="space-y-8">

          {/* Счётчик */}
          <div className="flex items-center justify-between text-sm text-zinc-500">
            {totalCount > 0 ? (
              <p>
                Найдено: <span className="font-semibold text-zinc-900">{totalCount}</span> моделей
                {totalPages > 1 && (
                  <span className="ml-2 text-zinc-400">
                    · страница {safePage} из {totalPages}
                  </span>
                )}
              </p>
            ) : null}
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-24 text-center">
              <div className="mb-6 rounded-full bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xl font-bold tracking-tight text-zinc-900">Ничего не найдено</p>
              <p className="mt-2 max-w-md text-base text-zinc-500">Попробуйте смягчить условия поиска или выберите другую категорию.</p>
              <Link href="/catalog" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Сбросить все фильтры
              </Link>
            </div>
          ) : (
            <>
              {/* Сетка товаров */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p as any} />
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  buildPageUrl={buildPageUrl}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== ПАГИНАЦИЯ ===== */

function Pagination({
  currentPage,
  totalPages,
  buildPageUrl,
}: {
  currentPage: number;
  totalPages: number;
  buildPageUrl: (page: number) => string;
}) {
  // Генерируем диапазон страниц с многоточием
  const getPages = () => {
    const pages: (number | "...")[] = [];
    const delta = 2; // соседние страницы вокруг текущей

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const btnBase =
    "flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-sm font-semibold transition-all";

  return (
    <nav className="flex items-center justify-center gap-1 pt-4" aria-label="Пагинация">
      {/* Назад */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className={`${btnBase} border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50`}
          aria-label="Предыдущая страница"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} border border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {/* Страницы */}
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className={`${btnBase} text-zinc-400 cursor-default`}>
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page as number)}
            className={`${btnBase} ${
              page === currentPage
                ? "bg-zinc-900 text-white shadow-md"
                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Вперёд */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className={`${btnBase} border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50`}
          aria-label="Следующая страница"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} border border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}

/* ===== ФОРМА ФИЛЬТРОВ ===== */

function hasAnyFilter(sp: SearchParams) {
  return Boolean(
    sp.brand || sp.category || sp.badge || sp.pricePreset || sp.min || sp.max || sp.q || sp.stock === "1" || sp.new === "1" || (sp.sort && sp.sort !== "default")
  );
}

function FilterForm({
  brands,
  categories,
  searchParams,
  pricePreset,
  mobile = false,
}: {
  brands: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
  searchParams: SearchParams;
  pricePreset?: PricePreset;
  mobile?: boolean;
}) {
  const presetButtons = (Object.keys(pricePresetMap) as PricePreset[]).map((value) => ({
    value,
    label: pricePresetMap[value].label,
  }));

  const inputClassName = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all hover:border-zinc-300 focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500";
  const labelClassName = "mb-3 block text-sm font-semibold text-zinc-900";

  return (
    <form className="space-y-8" method="GET">
      {/* Поиск */}
      <div>
        <label className={labelClassName}>Поиск</label>
        <div className="relative">
          <input type="text" name="q" placeholder="Например, G-Shock" defaultValue={searchParams.q ?? ""} className={`${inputClassName} pl-11`} />
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Бренд */}
      <div>
        <label className={labelClassName}>Линейка</label>
        <select name="brand" defaultValue={searchParams.brand ?? ""} className={inputClassName}>
          <option value="">Все бренды</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Категория */}
      <div>
        <label className={labelClassName}>Категория / пол</label>
        <select name="category" defaultValue={searchParams.category ?? ""} className={inputClassName}>
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Быстрая цена */}
      <div>
        <label className={labelClassName}>Бюджет</label>
        <div className="flex flex-col gap-2">
          {presetButtons.map((preset) => (
            <button
              key={preset.value}
              type="submit"
              name="pricePreset"
              value={preset.value}
              className={`w-full rounded-2xl px-5 py-3 text-left text-sm font-medium transition-all ${
                pricePreset === preset.value
                  ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900"
                  : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Цена вручную */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">От, ₽</label>
          <input type="number" min={0} name="min" className={`${inputClassName} text-center`} defaultValue={searchParams.min ?? ""} placeholder="0" />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">До, ₽</label>
          <input type="number" min={0} name="max" className={`${inputClassName} text-center`} defaultValue={searchParams.max ?? ""} placeholder="99 999" />
        </div>
      </div>

      {/* Бейдж */}
      <div>
        <label className={labelClassName}>Особые серии</label>
        <select name="badge" defaultValue={searchParams.badge ?? ""} className={inputClassName}>
          <option value="">Все серии</option>
          <option value="NEW">Новинки (New)</option>
          <option value="SALE">Скидки (Sale)</option>
          <option value="HIT">Хиты (Hit)</option>
          <option value="LIMITED">Лимитированные (Limited)</option>
        </select>
      </div>

      {/* Сортировка */}
      <div>
        <label className={labelClassName}>Сортировка</label>
        <select name="sort" defaultValue={searchParams.sort ?? "default"} className={inputClassName}>
          <option value="price_asc">Сначала дешевле</option>
          <option value="price_desc">Сначала дороже</option>
          <option value="new">Сначала новинки</option>
        </select>
      </div>

      {/* Кнопки */}
      <div className={`pt-4 ${mobile ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}`}>
        <button className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-zinc-800 active:scale-[0.98]">
          Применить
        </button>
        <Link href="/catalog" className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-100 px-4 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-200 active:scale-[0.98]">
          Сбросить
        </Link>
      </div>
    </form>
  );
}

function isPricePreset(value?: string): value is PricePreset {
  return value === "budget" || value === "middle" || value === "premium";
}