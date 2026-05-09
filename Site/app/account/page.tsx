// app/account/page.tsx
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const statusLabels: Record<string, string> = {
  pending: "Собирается",
  paid: "В пути",
  fulfilled: "Выдан",
  cancelled: "Отменен",
  refunded: "Возврат",
};

// Функция для красивых бейджей статусов
function getStatusStyles(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-zinc-600 ring-1 ring-zinc-400/20";
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

function maskPhone(p?: string | null) {
  if (!p) return "—";
  const digits = p.replace(/\D/g, "");
  if (digits.length < 6) return p;
  return p.replace(digits.slice(3, digits.length - 2), "****");
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/tg/help");

  // последние 5 заказов
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      number: true,
      status: true,
      totalCents: true,
      currency: true,
      createdAt: true,
      address: true,
    },
  });

  // открытые заказы (актуальные для пользователя)
  const openOrders = await prisma.order.findMany({
    where: {
      userId: user.id,
      status: { in: ["pending", "paid"] },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, number: true, status: true, totalCents: true, currency: true, createdAt: true },
  });

  // агрегаты
  const aggregates = await prisma.order.aggregate({
    where: { userId: user.id },
    _count: { _all: true },
    _sum: { totalCents: true },
  });

  // пару последних адресов (если есть)
  const lastAddresses = orders
    .map((o) =>
      typeof o.address === "object" && o.address && "text" in (o.address as any)
        ? ((o.address as any).text as string)
        : ""
    )
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-12">
      
      {/* Шапка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Профиль</p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Личный кабинет</h1>
        </div>
        <Link
          href="/api/auth/logout" prefetch={false}
          className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-red-600 pb-1"
        >
          <span>Выйти из аккаунта</span>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Левая колонка: Профиль и Метрики */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Данные пользователя */}
          <section className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl font-bold text-zinc-600">
                {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">{user.name || "Гость"}</h2>
                <p className="text-sm text-zinc-500">TG: {user.tgId}</p>
              </div>
            </div>

            <div className="space-y-5 border-t border-zinc-100 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Телефон</p>
                <p className="mt-1 font-medium text-zinc-900">{maskPhone(user.phone)}</p>
              </div>
              
              {lastAddresses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Адреса доставки</p>
                  <ul className="mt-2 space-y-2">
                    {lastAddresses.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm font-medium text-zinc-700">
                        <svg className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2 leading-tight">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Метрики */}
          <section className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-200/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Заказов</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{aggregates._count._all}</p>
            </div>
            <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">В работе</p>
              <p className="mt-1 text-2xl font-bold text-amber-900">{openOrders.length}</p>
            </div>
            <div className="col-span-2 rounded-3xl bg-zinc-900 p-6 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Сумма покупок</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                {fmtMoney(aggregates._sum.totalCents || 0, orders[0]?.currency || "RUB")}
              </p>
            </div>
          </section>

        </div>

        {/* Правая колонка: Заказы */}
        <div className="space-y-10 lg:col-span-2">
          
          {/* Открытые заказы */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Активные заказы</h2>
              {openOrders.length > 0 && (
                <Link href="/account/orders" className="text-sm font-semibold text-zinc-500 hover:text-zinc-500">
                  Все активные →
                </Link>
              )}
            </div>

            {openOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
                <div className="mb-4 rounded-full bg-white p-3 shadow-sm ring-1 ring-zinc-200">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-zinc-900">У вас нет активных заказов</p>
                <p className="mt-1 text-sm text-zinc-500">Самое время порадовать себя новыми часами.</p>
                <Link href="/catalog" className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {openOrders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/account/orders/${o.id}`}
                    className="group block rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-zinc-300 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-zinc-900">№ {o.number}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(o.status)}`}>
                            {statusLabels[o.status] ?? o.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-zinc-500">
                          Оформлен {o.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
                        <span className="text-lg font-bold tracking-tight text-zinc-900">
                          {fmtMoney(o.totalCents, o.currency)}
                        </span>
                        <span className="text-sm font-semibold text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 sm:block hidden">
                          Смотреть детали →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* История заказов */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">История заказов</h2>
              {orders.length > 0 && (
                <Link href="/account/orders" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900">
                  Смотреть всё →
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-zinc-500 px-2">История пуста.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/account/orders/${o.id}`}
                    className="group block rounded-2xl bg-white p-5 ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-zinc-900">№ {o.number}</span>
                        <span className="text-sm text-zinc-500">{o.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(o.status)}`}>
                          {statusLabels[o.status] ?? o.status}
                        </span>
                        <span className="font-semibold text-zinc-900">
                          {fmtMoney(o.totalCents, o.currency)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}