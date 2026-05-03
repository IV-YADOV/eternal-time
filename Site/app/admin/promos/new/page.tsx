// app/admin/promos/new/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generatePromoCode } from "@/lib/promo";
import Link from "next/link";

function toInt(v: FormDataEntryValue | null): number | null {
  const n = Number(v); return Number.isFinite(n) ? Math.trunc(n) : null;
}

async function createPromo(formData: FormData) {
  "use server";
  const code = (formData.get("code") || "").toString().trim().toUpperCase() || generatePromoCode("SALE");
  const type = (formData.get("type") || "PERCENT").toString() as "PERCENT" | "FIXED";
  const amount = toInt(formData.get("amount")) ?? 0;
  const isActive = formData.get("isActive") === "on";

  const startsAt = formData.get("startsAt") ? new Date(String(formData.get("startsAt"))) : null;
  const expiresAt = formData.get("expiresAt") ? new Date(String(formData.get("expiresAt"))) : null;

  const minOrderCents = toInt(formData.get("minOrderCents")) ? (toInt(formData.get("minOrderCents"))! * 100) : null;
  const maxUses = toInt(formData.get("maxUses"));
  const perUserLimit = toInt(formData.get("perUserLimit"));

  const ownerTgId = (formData.get("ownerTgId") || "").toString().trim();
  let ownerUserId: string | null = null;
  if (ownerTgId) {
    const u = await prisma.user.findUnique({ where: { tgId: ownerTgId }});
    ownerUserId = u?.id ?? null;
  }

  const created = await prisma.promoCode.create({
    data: {
      code,
      type,
      amount,
      isActive,
      startsAt: startsAt ?? undefined,
      expiresAt: expiresAt ?? undefined,
      minOrderCents: minOrderCents ?? undefined,
      maxUses: maxUses ?? undefined,
      perUserLimit: perUserLimit ?? undefined,
      ownerUserId: ownerUserId ?? undefined,
    },
    select: { id: true },
  });

  redirect(`/admin/promos/${created.id}`);
}

export default function NewPromoPage() {
  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300 placeholder:text-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20">
      
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/admin/promos" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к списку
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Новый промокод</h1>
        </div>
      </div>

      <form action={createPromo} className="space-y-8">
        
        {/* Секция 1: Основное */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-6">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">01</span>
              Базовые параметры
            </h2>
            <label className="flex cursor-pointer items-center gap-3 group">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">Активен</span>
              <div className="relative">
                <input type="checkbox" name="isActive" className="peer sr-only" defaultChecked />
                <div className="h-6 w-11 rounded-full bg-zinc-200 transition-colors peer-checked:bg-emerald-500" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
              </div>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Промокод</label>
              <input 
                name="code" 
                placeholder="Напр: SUMMER2026" 
                className={`${inputClass} font-mono uppercase text-base`} 
              />
              <p className="mt-2 text-[10px] text-zinc-400 font-medium">Оставьте пустым для автогенерации</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Тип скидки</label>
                <select name="type" className={inputClass} defaultValue="PERCENT">
                  <option value="PERCENT">% Процент</option>
                  <option value="FIXED">₽ Фикс</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Размер (Amount)</label>
                <input 
                  type="number" 
                  min={0} 
                  name="amount" 
                  className={inputClass} 
                  placeholder="10" 
                  required 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Секция 2: Ограничения */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">02</span>
            Лимиты и условия
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Мин. сумма заказа (₽)</label>
              <input type="number" min={0} name="minOrderCents" className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>Всего использований</label>
              <input type="number" min={0} name="maxUses" className={inputClass} placeholder="∞" />
            </div>
            <div>
              <label className={labelClass}>На одного юзера</label>
              <input type="number" min={0} name="perUserLimit" className={inputClass} placeholder="1" />
            </div>
          </div>
        </section>

        {/* Секция 3: Период и Персонализация */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">03</span>
            Время и Владелец
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Дата начала</label>
                <input type="datetime-local" name="startsAt" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Дата окончания</label>
                <input type="datetime-local" name="expiresAt" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Владелец (Telegram ID)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">@</span>
                <input name="ownerTgId" className={`${inputClass} pl-10`} placeholder="12345678" />
              </div>
              <p className="mt-2 text-[10px] text-zinc-400 font-medium italic">Для привязки кода к конкретному блогеру или клиенту</p>
            </div>
          </div>
        </section>

        {/* Кнопки */}
        <div className="flex items-center justify-end gap-6 pt-4">
          <Link href="/admin/promos" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
            Отмена
          </Link>
          <button className="flex h-14 items-center justify-center rounded-full bg-zinc-900 px-12 text-base font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]">
            Создать промокод
          </button>
        </div>
      </form>

      {/* Инфо-блок */}
      <div className="rounded-[2rem] bg-amber-50 border border-amber-100 p-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/20">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-900">На заметку</p>
          <p className="text-xs text-amber-800/70 leading-relaxed">
            Если вы выбираете тип <strong>₽ Фикс</strong>, вводите значение в рублях (напр. 500). Система автоматически пересчитает их в центы для базы данных. Для процентов просто вводите число (напр. 15).
          </p>
        </div>
      </div>
    </div>
  );
}