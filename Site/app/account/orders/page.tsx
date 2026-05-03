// app/account/orders/page.tsx
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  pending: "Собирается",
  paid: "В пути",
  fulfilled: "Выдан",
  cancelled: "Отменен",
  refunded: "Возврат",
};

function getStatusStyles(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-500/20";
    case "paid":
      return "bg-blue-100 text-blue-800 ring-1 ring-blue-500/20";
    case "fulfilled":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/20";
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-800 ring-1 ring-red-500/20";
    default:
      return "bg-zinc-100 text-zinc-800 ring-1 ring-zinc-500/20";
  }
}

function fmtMoney(cents: number, currency = "RUB") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/tg/help");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, number: true, status: true, totalCents: true, currency: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      
      {/* Навигация и заголовок */}
      <div className="space-y-4">
        <Link 
          href="/account" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          В личный кабинет
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          История заказов
        </h1>
      </div>

      {/* Список заказов */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-zinc-200">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-zinc-900">Заказов пока нет</p>
          <p className="mt-2 text-sm text-zinc-500">Здесь будет храниться история всех ваших покупок.</p>
          <Link href="/catalog" className="mt-6 rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link 
              key={o.id} 
              href={`/account/orders/${o.id}`} 
              className="group block rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-zinc-300 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                
                {/* Левая часть: Номер и дата */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-zinc-900">Заказ № {o.number}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(o.status)}`}>
                      {statusLabels[o.status] ?? o.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-500">
                    Оформлен {o.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Правая часть: Сумма и стрелочка */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-xl font-bold tracking-tight text-zinc-900">
                    {fmtMoney(o.totalCents, o.currency)}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 opacity-0 transition-opacity group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 transition-transform">
                    Подробнее
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}