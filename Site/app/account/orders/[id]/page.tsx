// app/account/orders/[id]/page.tsx
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
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

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=200&q=70` : safe;
}

export default async function OrderDetails({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/tg/help");

  // грузим заказ и проверяем владельца
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  });

  if (!order || order.userId !== user.id) notFound();

  const formattedDate = order.createdAt.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      
      {/* Шапка и навигация */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6">
        <div className="space-y-3">
          <Link 
            href="/account/orders" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            К списку заказов
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Заказ №{order.number}</h1>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyles(order.status)}`}>
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        
        {/* Левая колонка: Детали заказа */}
        <div className="space-y-6 lg:col-span-1">
          <section className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-zinc-200 shadow-sm">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">Информация</h2>
            </div>
            <dl className="divide-y divide-zinc-100">
              <div className="px-6 py-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Дата оформления</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900">{formattedDate}</dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Сумма заказа</dt>
                <dd className="mt-1 text-lg font-bold text-zinc-900">{fmtMoney(order.totalCents, order.currency)}</dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Связь ({order.contactMethod})</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900">{order.contactValue}</dd>
              </div>
              <div className="px-6 py-4 bg-zinc-50/30">
                <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Адрес доставки</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 leading-relaxed">
                  {(order.address as any)?.text ?? "Не указан"}
                </dd>
              </div>
              {order.comment && (
                <div className="px-6 py-4 bg-amber-50/30">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-amber-700">Комментарий</dt>
                  <dd className="mt-1 text-sm font-medium text-amber-900 whitespace-pre-wrap">{order.comment}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {/* Правая колонка: Состав заказа */}
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-zinc-200 shadow-sm">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Состав заказа</h2>
              <span className="text-sm font-medium text-zinc-500">{order.items.length} поз.</span>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {order.items.map((it) => {
                const product = it.variant.product;
                const images = (product.images as string[]) ?? [];
                const firstImg = images[0] ?? "https://picsum.photos/200/200";

                return (
                  <div key={it.id} className="flex gap-4 p-6 transition-colors hover:bg-zinc-50/50 sm:items-center">
                    
                    {/* Миниатюра */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200 sm:h-24 sm:w-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={buildImgSrc(firstImg)} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Информация о товаре */}
                    <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center gap-4">
                      <div className="space-y-1">
                        <Link 
                          href={`/product/${product.slug}`} 
                          className="font-bold text-zinc-900 hover:text-amber-600 transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          SKU: {it.variant.sku ?? it.variantId}
                        </p>
                      </div>

                      {/* Цена и количество */}
                      <div className="flex items-center gap-6 sm:justify-end">
                        <div className="text-sm font-medium text-zinc-500">
                          {it.qty} шт.
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-zinc-900 whitespace-nowrap">
                            {fmtMoney(it.priceCents, order.currency)}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Итого */}
            <div className="bg-zinc-50 px-6 py-6 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">Итоговая сумма</span>
              <span className="text-2xl font-black tracking-tight text-zinc-900">
                {fmtMoney(order.totalCents, order.currency)}
              </span>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}