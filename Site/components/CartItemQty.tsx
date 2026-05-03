"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartItemQty({ initialQty, variantId }: { initialQty: number; variantId: string }) {
  const [qty, setQty] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateQty(newQty: number) {
    if (newQty < 1 || loading) return;
    setLoading(true);
    const oldQty = qty;
    setQty(newQty);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", variantId, qty: newQty - oldQty }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch (e) { setQty(oldQty); } 
    finally { setLoading(false); }
  }

  return (
    <div className="flex items-center gap-4 sm:gap-3 h-5">
      {/* Кнопка минус: увеличили область нажатия через p-1 */}
      <button
        onClick={() => updateQty(qty - 1)}
        disabled={qty <= 1 || loading}
        className="p-1 -ml-1 text-zinc-300 hover:text-red-500 transition-colors disabled:opacity-0 touch-manipulation"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      
      <span className="text-[10px] font-black text-zinc-900 tracking-widest flex items-baseline gap-0.5 select-none">
        {qty} <span className="text-[8px] text-zinc-300 uppercase">шт</span>
      </span>

      {/* Кнопка плюс */}
      <button
        onClick={() => updateQty(qty + 1)}
        disabled={loading}
        className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors touch-manipulation"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}