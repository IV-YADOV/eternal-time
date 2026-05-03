// app/admin/promos/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
}

export default async function AdminPromosList() {
  // Агрегируем данные для дашборда
  const [promos, stats, totalDiscounts] = await Promise.all([
    // 1. Список промокодов
    prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        ownerUser: { select: { id: true, tgId: true, name: true } },
      },
      take: 100,
    }),
    // 2. Общая статистика использований
    prisma.promoCode.aggregate({
      _sum: { usedCount: true },
      _count: { id: true },
    }),
    // 3. Реальная сумма скидок из таблицы заказов (сколько денег реально "ушло" в скидки)
    prisma.order.aggregate({
      _sum: { discountCents: true },
    }),
  ]);

  const activeCount = promos.filter(p => p.isActive).length;
  const totalUsed = stats._sum.usedCount || 0;
  const totalSavedCents = totalDiscounts._sum.discountCents || 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-20">
      
      {/* ХЕДЕР И ЦИФРЫ */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">Промокоды</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Аналитика и управление программой лояльности</p>
          </div>
          <Link 
            href="/admin/promos/new" 
            className="inline-flex h-14 items-center justify-center rounded-full bg-zinc-900 px-10 text-sm font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-amber-600 active:scale-95"
          >
            Создать промокод
          </Link>
        </div>

        {/* ПАНЕЛЬ МЕТРИК */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {/* Карта 1: Общий профит для клиентов */}
          <div className="rounded-[2.5rem] bg-amber-500 p-8 text-white shadow-xl shadow-amber-500/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Выдано скидок на сумму</p>
            <h2 className="mt-2 text-4xl font-black tracking-tighter">
              {formatMoney(totalSavedCents)}
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Live Data</span>
            </div>
          </div>

          {/* Карта 2: Использования */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Всего активаций</p>
            <h2 className="mt-2 text-4xl font-black tracking-tighter text-zinc-900">
              {totalUsed} <span className="text-lg text-zinc-300">раз</span>
            </h2>
            <p className="mt-4 text-xs font-bold text-emerald-500 flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Положительная динамика
            </p>
          </div>

          {/* Карта 3: Активность */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Активные кампании</p>
            <h2 className="mt-2 text-4xl font-black tracking-tighter text-zinc-900">
              {activeCount} <span className="text-lg text-zinc-300">из {stats._count.id}</span>
            </h2>
            <p className="mt-4 text-xs font-bold text-zinc-500">
              {((activeCount / stats._count.id) * 100).toFixed(0)}% кодов в работе
            </p>
          </div>
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Реестр кодов</h3>
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Код</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Скидка</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Эффективность</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400">Владелец</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-zinc-400 text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {promos.map((p) => (
                  <tr key={p.id} className="group transition-colors hover:bg-zinc-50/30">
                    <td className="px-8 py-6">
                      <Link 
                        href={`/admin/promos/${p.id}`} 
                        className="font-mono text-sm font-black text-zinc-900 bg-zinc-100 px-4 py-1.5 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-all"
                      >
                        {p.code}
                      </Link>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-zinc-900">
                          {p.type === "PERCENT" ? `${p.amount}%` : formatMoney(p.amount)}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-tighter">
                          {p.type === "PERCENT" ? "От суммы заказа" : "Вычитаемая сумма"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                          <span>{p.usedCount} исп.</span>
                          <span>{p.maxUses ? `${p.maxUses} лимит` : "без лимита"}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${p.usedCount >= (p.maxUses || 99999) ? "bg-red-400" : "bg-amber-500"}`}
                            style={{ width: `${Math.min((p.usedCount / (p.maxUses || 100)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      {p.ownerUser ? (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 ring-1 ring-zinc-200">
                            {p.ownerUser.name?.slice(0,1) || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-900">{p.ownerUser.name || "Партнер"}</span>
                            <span className="text-[10px] font-medium text-amber-600 font-mono">ID:{p.ownerUser.tgId}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">—</span>
                      )}
                    </td>

                    <td className="px-8 py-6 text-right">
                       <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${
                         p.isActive 
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                          : "bg-zinc-100 text-zinc-400 ring-zinc-500/10"
                       }`}>
                          {p.isActive ? "Активен" : "Пауза"}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-10 border-t border-zinc-100 flex items-center justify-between">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">EternalTick Analytics Engine</p>
         <div className="flex gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Система активна</span>
         </div>
      </footer>
    </div>
  );
}