// app/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=128&q=70` : safe;
}

export default async function AdminProducts() {
  // Собираем данные для дашборда параллельно
  const [products, stats] = await Promise.all([
    prisma.product.findMany({
      include: {
        brand: true,
        variants: { orderBy: { id: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.aggregate({
      _count: { id: true },
      where: { isArchived: false }
    })
  ]);

  // Считаем общую стоимость склада (по базовым вариантам)
  const totalInventoryValue = products.reduce((acc, p) => {
    const base = p.variants.find(v => v.sku?.endsWith("-base")) || p.variants[0];
    return acc + (base?.priceCents || 0);
  }, 0);

  const archivedCount = products.filter(p => p.isArchived).length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-20">
      
      {/* 1. ХЕДЕР И СТАТИСТИКА */}
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">Товары</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Управление товарной матрицей EternalTick</p>
          </div>
          <Link 
            href="/admin/products/new" 
            className="inline-flex h-14 items-center justify-center rounded-full bg-zinc-900 px-10 text-sm font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-amber-600 active:scale-95"
          >
            Добавить модель
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {/* Стоимость склада */}
          <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Оценка склада (база)</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter">
              {formatMoney(totalInventoryValue)}
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-amber-500">Retail Value</p>
          </div>

          {/* Активные товары */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Активных моделей</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {stats._count.id} <span className="text-lg text-zinc-300">ед.</span>
            </h2>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Доступно на витрине
            </div>
          </div>

          {/* Архив */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">В архиве</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {archivedCount} <span className="text-lg text-zinc-300">мод.</span>
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Скрыты из поиска</p>
          </div>
        </div>
      </div>

      {/* 2. ТАБЛИЦА ТОВАРОВ */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Инвентарная ведомость</h3>
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Модель</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Бренд</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Цена (Базовая)</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <p className="text-zinc-400 font-medium italic text-sm">Каталог пуст</p>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const base = p.variants.find(v => v.sku?.endsWith("-base")) || p.variants[0];
                    const images = (p.images as string[]) || [];
                    const firstImg = images[0] || "https://via.placeholder.com/100";

                    return (
                      <tr key={p.id} className="group transition-colors hover:bg-zinc-50/30">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-6"> 
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-zinc-50 ring-1 ring-zinc-200/50 group-hover:ring-amber-200 transition-all">
                              <img 
                                src={buildImgSrc(firstImg)} 
                                alt="" 
                                className="h-full w-full object-contain p-2 transition-transform group-hover:scale-110" 
                              />
                            </div>
                            
                            <div className="min-w-0 space-y-1">
                              <Link 
                                href={`/admin/products/${p.id}`} 
                                className="block font-black text-lg text-zinc-900 hover:text-amber-600 transition-colors line-clamp-1 uppercase tracking-tight"
                              >
                                {p.name}
                              </Link>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                                  {p.variants.length} SKU
                                </span>
                                {p.isArchived && (
                                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 ring-1 ring-zinc-200">
                                    Архив
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 ring-1 ring-zinc-200/50">
                            {p.brand?.name ?? "No Brand"}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-base font-black text-zinc-900 uppercase">
                              {base ? formatMoney(base.priceCents) : "—"}
                            </span>
                            {base?.sku && (
                              <span className="text-[10px] font-bold text-amber-600 font-mono tracking-tighter">
                                {base.sku}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              href={`/admin/products/${p.id}`} 
                              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 px-5 text-xs font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white active:scale-95"
                            >
                              Изменить
                            </Link>
                            
                            <Link 
                              href={`/watch/${p.slug}`} 
                              target="_blank"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-all hover:bg-zinc-100 hover:text-zinc-900"
                              title="На сайт"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-10 border-t border-zinc-100 flex items-center justify-between">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">EternalTick Inventory v.4.0</p>
         <div className="flex gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Items: {products.length}</span>
         </div>
      </footer>
    </div>
  );
}