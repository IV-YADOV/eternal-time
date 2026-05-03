// app/admin/orders/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteOrderForm from "@/components/DeleteOrderForm";

function money(cents: number, currency: string) {
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
  revalidatePath(`/admin/orders/${id}`);
}

async function deleteOrder(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  redirect("/admin/orders?deleted=1");
}

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      promoCode: { select: { code: true } },
      items: {
        include: {
          variant: { 
            include: { 
              product: { select: { name: true, slug: true, images: true } } 
            } 
          },
        },
      },
    },
  });

  if (!order) notFound();

  const subtotal = order.items.reduce((s, i) => s + i.priceCents * i.qty, 0);
  const hasDiscount = (order.discountCents ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Шапка заказа */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link href="/admin/orders" className="group inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900">
            <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Заказ №{order.number}</h1>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusStyles(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">Создан: {new Date(order.createdAt).toLocaleString("ru-RU")}</p>
        </div>
        
        <div className="flex gap-3">
          <DeleteOrderForm action={deleteOrder} orderId={order.id} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* ЛЕВАЯ КОЛОНКА: Товары и Состав */}
        <div className="lg:col-span-2 space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 font-bold text-zinc-900">
              Состав заказа ({order.items.length})
            </div>
            <div className="divide-y divide-zinc-100">
              {order.items.map((it) => {
                const images = (it.variant.product.images as string[]) || [];
                const firstImg = images[0] || "https://picsum.photos/200/200";
                
                return (
                  <div key={it.id} className="flex gap-6 p-6 transition-colors hover:bg-zinc-50/30">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={firstImg} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between gap-4">
                        <Link 
                          href={`/product/${it.variant.product.slug}`} 
                          target="_blank"
                          className="font-bold text-zinc-900 hover:text-amber-600 transition-colors line-clamp-1"
                        >
                          {it.variant.product.name}
                        </Link>
                        <span className="font-bold text-zinc-900">{money(it.priceCents * it.qty, order.currency)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                          SKU: {it.variant.sku}
                        </div>
                        <div className="text-zinc-500">
                          {money(it.priceCents, order.currency)} × {it.qty} шт.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Комментарий менеджера/клиента */}
          {order.comment && (
            <section className="rounded-[2rem] border border-amber-200 bg-amber-50/30 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Комментарий к заказу</h3>
              <p className="text-sm text-amber-900 font-medium leading-relaxed whitespace-pre-wrap">
                {order.comment}
              </p>
            </section>
          )}
        </div>

        {/* ПРАВАЯ КОЛОНКА: Статус, Клиент, Деньги */}
        <div className="space-y-6">
          
          {/* Блок управления статусом */}
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-200/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Управление статусом</h3>
            <form action={setStatus} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={order.id} />
              <select 
                name="status" 
                defaultValue={order.status} 
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              >
                <option value="Собирается">Собирается</option>
                <option value="В пути">В пути</option>
                <option value="Ожидает получения">Ожидает получения</option>
                <option value="Выдан">Выдан</option>
                <option value="Отменен">Отменен</option>
                <option value="Возврат">Возврат</option>
              </select>
              <button className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-[0.98]">
                Обновить статус
              </button>
            </form>
          </section>

          {/* Информация о покупателе */}
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-200/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Покупатель</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Имя</p>
                <p className="text-sm font-bold text-zinc-900">{order.customerName}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{order.contactMethod}</p>
                  <p className="text-sm font-bold text-zinc-900 break-all">{order.contactValue}</p>
                </div>
                {order.email && (
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email</p>
                    <p className="text-sm font-bold text-zinc-900 break-all">{order.email}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Адрес доставки</p>
                <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                  {typeof order.address === "object" && order.address && "text" in (order.address as any)
                    ? (order.address as any).text
                    : "Адрес не указан"}
                </p>
              </div>
            </div>
          </section>

          {/* Финансовый расчет */}
          <section className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Финансы</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Стоимость товаров</span>
                <span className="font-semibold">{money(subtotal, order.currency)}</span>
              </div>
              
              {hasDiscount && (
                <div className="flex justify-between text-sm text-emerald-400 font-medium">
                  <span>Скидка по купону</span>
                  <span>−{money(order.discountCents, order.currency)}</span>
                </div>
              )}

              {order.promoCode?.code && (
                <div className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">
                  Промокод: {order.promoCode.code}
                </div>
              )}

              <hr className="border-zinc-800" />
              
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold uppercase tracking-widest">Итого</span>
                <span className="text-2xl font-black tracking-tight text-amber-500">
                  {money(order.totalCents, order.currency)}
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}