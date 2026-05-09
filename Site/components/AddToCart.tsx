"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartItemQty from "./CartItemQty"; // Импортируем твой компактный контроллер

export default function AddToCart({ 
  variantId, 
  initialQty = 0 
}: { 
  variantId: string; 
  initialQty?: number 
}) {
  const [isPending, startTransition] = useTransition();
  const [qty, setQty] = useState(initialQty);
  const router = useRouter();

  // Синхронизируем внутреннее состояние, если корзина обновилась извне
  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const handleInitialAdd = () => {
    startTransition(async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", variantId, qty: 1 })
      });

      if (res.ok) {
        setQty(1);
        window.dispatchEvent(new Event("cart:changed"));
        router.refresh();
      }
    });
  };

  // Если товар уже есть в корзине (qty > 0), показываем контроллер
  if (qty > 0) {
    return (
      <div className="flex items-center justify-between w-full h-[52px] px-6 rounded-full bg-zinc-50 border border-zinc-200/50 shadow-sm animate-in fade-in zoom-in duration-300">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          В корзине
        </span>
        <CartItemQty initialQty={qty} variantId={variantId} />
      </div>
    );
  }

  // Если товара нет — обычная кнопка
  return (
    <button
      disabled={isPending}
      onClick={handleInitialAdd}
      className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-8 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70"
    >
      <span className={`transition-all duration-300 ${isPending ? "opacity-0" : "opacity-100"}`}>
        Добавить в корзину
      </span>
      
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}
    </button>
  );
}