// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function money(cents: number, currency: string = "RUB") {
  return (cents / 100).toLocaleString("ru-RU", { 
    style: "currency", 
    currency,
    maximumFractionDigits: 0 
  });
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Собирается": return "bg-amber-100 text-amber-700 ring-amber-600/20";
    case "В пути": return "bg-blue-100 text-blue-700 ring-blue-600/20";
    case "Ожидает получения": return "bg-purple-100 text-purple-700 ring-purple-600/20";
    case "Выдан": return "bg-emerald-100 text-emerald-700 ring-emerald-600/20";
    case "Отменен":
    case "Возврат": return "bg-red-100 text-red-700 ring-red-600/20";
    default: return "bg-zinc-100 text-zinc-600 ring-zinc-500/10";
  }
}

async function setStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export default async function AdminOrders() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Собираем аналитику
  const [orders, stats, todayCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { promoCode: { select: { code: true } } },
    }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      _count: { id: true },
      where: { status: { notIn: ["Отменен", "Возврат"] } }
    }),
    prisma.order.count({
      where: { createdAt: { gte: startOfToday } }
    })
  ]);

  const totalRevenue = stats._sum.totalCents || 0;
  const activeOrders = orders.filter(o => ["Собирается", "В пути", "Ожидает получения"].includes(o.status)).length;
  const avgCheck = stats._count.id > 0 ? Math.round(totalRevenue / stats._count.id) : 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-20 text-zinc-900">
      
      {/* 1. ХЕДЕР И ДАШБОРД */}
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Заказы</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Управление заказами и клиентским сервисом</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 items-center gap-3 rounded-full bg-zinc-100 px-6 text-xs font-black uppercase tracking-widest text-zinc-500">
              Сегодня: <span className="text-zinc-900">{todayCount}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {/* Общая выручка */}
          <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Оборот системы</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter">
              {money(totalRevenue)}
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Подтвержденные продажи
            </p>
          </div>

          {/* Заказы в работе */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">В обработке</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {activeOrders} <span className="text-lg text-zinc-300">активных</span>
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-amber-500">Требуют внимания</p>
          </div>

          {/* Средний чек */}
          <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm ring-1 ring-zinc-200/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Средний чек</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-zinc-900">
              {money(avgCheck)}
            </h2>
            <p className="mt-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Эффективность продаж</p>
          </div>
        </div>
      </div>

      {/* 2. ТАБЛИЦА ЗАКАЗОВ */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Журнал транзакций</h3>
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  <th className="px-8 py-5">№ Заказа</th>
                  <th className="px-8 py-5">Клиент / Контакт</th>
                  <th className="px-8 py-5">Сумма</th>
                  <th className="px-8 py-5">Статус</th>
                  <th className="px-8 py-5 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <p className="text-zinc-400 font-medium italic text-sm">Очередь заказов пуста</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="group transition-colors hover:bg-zinc-50/30">
                      {/* Номер и дата */}
                      <td className="px-8 py-6">
                        <Link href={`/admin/orders/${o.id}`} className="block font-black text-lg text-zinc-900 hover:text-amber-600 transition-all uppercase tracking-tight">
                          #{o.number}
                        </Link>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {new Date(o.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                      </td>
                      
                      {/* Клиент */}
                      <td className="px-8 py-6">
                        <div className="font-bold text-zinc-900">{o.customerName}</div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                          <span className="opacity-40 uppercase font-black">{o.contactMethod}:</span>
                          <span className="text-zinc-700">{o.contactValue}</span>
                        </div>
                      </td>

                      {/* Сумма и Промо */}
                      <td className="px-8 py-6 text-base font-black text-zinc-900">
                        <div className="flex flex-col">
                          <span>{money(o.totalCents, o.currency)}</span>
                          {o.discountCents > 0 && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 ring-1 ring-emerald-500/20">
                                -{money(o.discountCents, o.currency)}
                              </span>
                              {o.promoCode?.code && (
                                <span className="text-[9px] font-bold uppercase text-zinc-300 tracking-widest italic">{o.promoCode.code}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Бейдж статуса */}
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusStyles(o.status)}`}>
                          {o.status}
                        </span>
                      </td>

                      {/* Управление */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          <form action={setStatus} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={o.id} />
                            <select 
                              name="status" 
                              defaultValue={o.status} 
                              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 cursor-pointer hover:border-zinc-300"
                            >
                              <option value="Собирается">Собирается</option>
                              <option value="В пути">В пути</option>
                              <option value="Ожидает получения">Ожидает получения</option>
                              <option value="Выдан">Выдан</option>
                              <option value="Отменен">Отменен</option>
                              <option value="Возврат">Возврат</option>
                            </select>
                            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all hover:bg-amber-500 active:scale-90">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </form>
                          
                          <Link 
                            href={`/admin/orders/${o.id}`} 
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

      {/* ФУТЕР */}
      <footer className="pt-10 border-t border-zinc-100 flex items-center justify-between">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 text-center sm:text-left">EternalTick Fulfillment System v.1.0</p>
         <div className="hidden sm:flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Entries: {orders.length}</span>
         </div>
      </footer>
    </div>
  );
}