import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Принудительно отключаем кэширование роута
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Достаем ID корзины именно этого пользователя из кук
    const cartId = cookies().get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json({ count: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { 
        items: {
          select: { qty: true } // Берем только количество для оптимизации
        } 
      },
    });

    const count = cart ? cart.items.reduce((sum, it) => sum + it.qty, 0) : 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}