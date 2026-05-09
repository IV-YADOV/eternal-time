import { getCart } from "@/lib/cart";
import Link from "next/link";
import Price from "@/components/Price";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PromoType } from "@prisma/client";
import { normalizeCode } from "@/lib/promo";
import CartItemQty from "@/components/CartItemQty";

// Константы для куки
const PROMO_COOKIE = "promoCode";

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=400&q=70` : safe;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Расчет скидки */
function calculateDiscount(totalCents: number, promo?: { type: PromoType; amount: number } | null) {
  if (!promo) return 0;
  if (promo.type === "PERCENT") {
    const pct = clamp(promo.amount, 0, 100);
    return clamp(Math.floor((totalCents * pct) / 100), 0, totalCents);
  }
  // Тип FIXED (в базе хранятся центы)
  return clamp(promo.amount, 0, totalCents);
}

// ——— Server Actions ———

async function removeItem(formData: FormData) {
  "use server";
  const itemId = String(formData.get("itemId") || "");
  const cartId = cookies().get("cartId")?.value;
  if (!itemId || !cartId) return;

  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });
  revalidatePath("/cart");
}

async function applyPromo(formData: FormData) {
  "use server";
  const rawCode = String(formData.get("promoCode") || "").trim();
  
  if (!rawCode) {
    cookies().delete(PROMO_COOKIE);
    redirect("/cart");
  }

  const code = normalizeCode(rawCode);
  
  // Устанавливаем куку с нормализованным кодом
  cookies().set({
    name: PROMO_COOKIE,
    value: code,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });

  revalidatePath("/cart");
  redirect("/cart"); // Перезагружаем, чтобы сработала логика проверки в CartPage
}

async function clearPromo() {
  "use server";
  cookies().delete(PROMO_COOKIE);
  revalidatePath("/cart");
  redirect("/cart");
}

export default async function CartPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const cart = await getCart();

  // 1. Проверка на пустую корзину
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-24 text-center">
          <div className="mb-6 rounded-full bg-white p-5 shadow-sm ring-1 ring-zinc-200 text-zinc-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Ваша корзина пуста</h1>
          <p className="mt-4 text-base text-zinc-500">Добавьте модели из каталога, чтобы оформить заказ.</p>
          <Link href="/catalog" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, it) => sum + it.qty * it.variant.priceCents, 0);

  // 2. Логика проверки промокода
  const promoCodeCookie = cookies().get(PROMO_COOKIE)?.value ?? null;
  let promo: { type: PromoType; amount: number; code: string } | null = null;
  let promoError: string | null = null;

  if (promoCodeCookie) {
    const code = normalizeCode(promoCodeCookie);
    const found = await prisma.promoCode.findUnique({ where: { code } });
    const now = new Date();

    if (!found) {
      promoError = "Промокод не найден";
    } else if (!found.isActive) {
      promoError = "Промокод больше не активен";
    } else if (found.startsAt && now < found.startsAt) {
      promoError = "Срок действия кода еще не начался";
    } else if (found.expiresAt && now > found.expiresAt) {
      promoError = "Срок действия кода истек";
    } else if (found.maxUses !== null && found.usedCount >= found.maxUses) {
      promoError = "Лимит использований исчерпан";
    } else if (found.minOrderCents !== null && subtotal < found.minOrderCents) {
      const remaining = (found.minOrderCents - subtotal) / 100;
      promoError = `Добавьте товаров еще на ${remaining} ₽ для применения кода`;
    } else {
      // Все проверки пройдены
      promo = { type: found.type, amount: found.amount, code: found.code };
    }
  }

  const discount = calculateDiscount(subtotal, promo);
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl uppercase">Корзина</h1>
      
      <div className="grid gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] lg:items-start">
        
        {/* ЛЕВАЯ ЧАСТЬ: Список товаров */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
            <div className="divide-y divide-zinc-100">
              {cart.items.map((it) => {
                const images = (it.variant.product.images as string[]) || [];
                const firstImg = images[0] ?? "https://picsum.photos/400/400";
                
                return (
                  <div key={it.id} className="flex flex-col gap-3 p-8 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-zinc-50/30">
                    <div className="flex items-center gap-3 ">
  {/* Убрали bg-zinc-50, чтобы под картинкой был только чистый белый фон родителя */}
  <div className="relative h-28 w-28 bg-zinc-50 shrink-0 overflow-hidden rounded-3xl ring-1 ring-zinc-200/50">
    <img
      src={buildImgSrc(firstImg)}
      alt={it.variant.product.name}
      /* ДОБАВЛЕНО: 
         1. mix-blend-multiply — делает идеально белый фон картинки прозрачным.
         2. relative z-10 — на всякий случай для корректного наложения слоев.
      */
      className="h-full w-full object-contain p-2 mix-blend-multiply relative z-10"
    />
  </div>
  
                      <div className="flex flex-col gap-1.5 sm:gap-3">
  <Link href={`/product/${it.variant.product.slug}`} 
        className="font-black text-base sm:text-xl text-zinc-900 leading-tight tracking-tight hover:text-zinc-500 transition-colors line-clamp-2 uppercase">
    {it.variant.product.name}
  </Link>
  
  {/* Группируем SKU и Qty: на мобилках в столбик, на десктопе в ряд */}
  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 leading-none">
      {it.variant.sku}
    </span>
    
    {/* Разделитель скрываем на мобилках, показываем на десктопе */}
    <span className="hidden sm:block h-1 w-1 rounded-full bg-zinc-200" />
    
    <CartItemQty initialQty={it.qty} variantId={it.variantId} />
  </div>
</div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-3">
                      <div className="text-xl font-black text-zinc-900">
                        <Price cents={it.variant.priceCents * it.qty} />
                      </div>
                      <form action={removeItem}>
                        <input type="hidden" name="itemId" value={it.id} />
                        <button type="submit" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-red-500">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Удалить
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Итоги */}
        <aside className="sticky top-24 space-y-6">
          <div className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200 shadow-xl shadow-zinc-200/50 space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900">Итого</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-zinc-500 uppercase tracking-widest">
                <span>Товары</span>
                <Price cents={subtotal} />
              </div>
              
              {promo && discount > 0 && (
                <div className="flex justify-between text-sm font-bold text-emerald-600 uppercase tracking-widest">
                  <span>Скидка ({promo.code})</span>
                  <Price cents={-discount} />
                </div>
              )}
              
              <div className="pt-6 border-t border-zinc-100 flex items-end justify-between">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">К оплате</span>
                <span className="text-4xl font-black tracking-tighter text-zinc-900">
                  <Price cents={total} />
                </span>
              </div>
            </div>

            {/* Блок промокода */}
            <div className="space-y-4 pt-2">
              <form action={applyPromo} className="relative group">
                <input
                  name="promoCode"
                  type="text"
                  placeholder="Промокод"
                  defaultValue={promoCodeCookie ?? ""}
                  className={`w-full rounded-2xl border ${promoError ? 'border-red-200 bg-red-50/30' : 'border-zinc-200 bg-zinc-50'} px-5 py-4 text-sm font-bold uppercase tracking-widest outline-none transition-all focus:ring-1 focus:ring-zinc-400 group-hover:border-zinc-300`}
                  autoComplete="off"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 rounded-xl bg-zinc-900 px-6 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-400 active:scale-95">
                  Применить
                </button>
              </form>

              {promoError && (
                <p className="px-2 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">
                  {promoError}
                </p>
              )}

              {promo && !promoError && (
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Код применен успешно
                  </span>
                  <form action={clearPromo}>
                    <button type="submit" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors">
                      Удалить
                    </button>
                  </form>
                </div>
              )}
            </div>

            <Link 
              href="/checkout" 
              className="flex h-16 w-full items-center justify-center rounded-full bg-zinc-800 px-8 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-zinc-400/20 transition-all hover:scale-[1.02] hover:bg-zinc-500 active:scale-[0.98]"
            >
              Оформить заказ
            </Link>
          </div>

          <p className="text-center text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 px-8">
            Нажимая кнопку, вы подтверждаете согласие с условиями EternalTime.
          </p>
        </aside>

      </div>
    </div>
  );
}