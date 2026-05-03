import { cookies } from "next/headers";
import { prisma } from "./prisma";

const CART_COOKIE = "cartId";

async function cookieStore() {
  return await cookies();
}

async function setCartCookie(id: string) {
  const store = await cookieStore();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  });
}

/** * ИСПРАВЛЕНО: Теперь проверяет существование корзины в БД 
 */
export async function getOrCreateCartId(): Promise<string> {
  const store = await cookieStore();
  const cartIdInCookie = store.get(CART_COOKIE)?.value;

  if (cartIdInCookie) {
    // Проверяем, есть ли такая корзина в базе
    const cart = await prisma.cart.findUnique({
      where: { id: cartIdInCookie },
      select: { id: true }
    });

    if (cart) return cart.id;
  }

  // Если куки нет или корзина не найдена в БД — создаем новую
  const newCart = await prisma.cart.create({ data: {} });
  await setCartCookie(newCart.id);
  return newCart.id;
}

/** Получить текущую корзину (безопасно) */
export async function getCart() {
  const store = await cookieStore();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null;

  return prisma.cart.findUnique({
    where: { id },
    include: {
      items: {
        // ДОБАВЛЯЕМ СОРТИРОВКУ ЗДЕСЬ
        orderBy: {
          id: 'asc' 
        },
        include: { 
          variant: { 
            include: { product: true } 
          } 
        }
      },
    },
  });
}

/** Остальные функции (getOrCreateUserCart, mergeGuestCartToUser) 
 * должны также использовать логику проверки существования, 
 * но база там обычно создается гарантированно.
 */

/** Найти или создать персональную корзину пользователя и синхронизировать cookie на неё */
export async function getOrCreateUserCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }
  // Подменяем cookie, чтобы фронт всегда работал с персональной корзиной
  setCartCookie(cart.id);
  return cart;
}

/**
 * Слить гостевую корзину (из cookie cartId) в персональную корзину пользователя.
 * Вызывать сразу после успешного логина.
 */
export async function mergeGuestCartToUser(userId: string) {
  const store = await cookieStore();
  const guestCartId = store.get(CART_COOKIE)?.value;

  // Находим/создаём персональную корзину
  const personal = await getOrCreateUserCart(userId);

  if (!guestCartId || guestCartId === personal.id) {
    // Нечего сливать или cookie уже на персональную корзину
    return;
  }

  await prisma.$transaction(async (tx) => {
    const guest = await tx.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    });

    if (!guest) {
      // просто синхронизируем cookie на персональную
      setCartCookie(personal.id);
      return;
    }

    // Слияние позиций
    for (const it of guest.items) {
      const existing = await tx.cartItem.findFirst({
        where: { cartId: personal.id, variantId: it.variantId },
      });
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { qty: existing.qty + it.qty },
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: personal.id, variantId: it.variantId, qty: it.qty },
        });
      }
    }

    // Чистим гостевую корзину и переключаем cookie на персональную
    await tx.cart.delete({ where: { id: guest.id } });
    setCartCookie(personal.id);
  });
}
