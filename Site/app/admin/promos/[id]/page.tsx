// app/admin/promos/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import SavedToast from "@/components/SavedToast";
import DeletePromoButton from "@/components/admin/DeletePromoButton";

function toInt(v: FormDataEntryValue | null): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

async function updatePromo(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const code = (formData.get("code") || "").toString().trim().toUpperCase();
  const type = (formData.get("type") || "PERCENT").toString() as "PERCENT" | "FIXED";
  const amount = toInt(formData.get("amount")) ?? 0;
  const isActive = formData.get("isActive") === "on";

  const startsAt = formData.get("startsAt") ? new Date(String(formData.get("startsAt"))) : null;
  const expiresAt = formData.get("expiresAt") ? new Date(String(formData.get("expiresAt"))) : null;

  // Конвертируем рубли в центы при сохранении
  const minOrderValue = toInt(formData.get("minOrderValue"));
  const minOrderCents = minOrderValue ? minOrderValue * 100 : null;
  
  const maxUses = toInt(formData.get("maxUses"));
  const perUserLimit = toInt(formData.get("perUserLimit"));

  const ownerTgId = (formData.get("ownerTgId") || "").toString().trim();
  let ownerUserId: string | null = null;
  if (ownerTgId) {
    const u = await prisma.user.findUnique({ where: { tgId: ownerTgId } });
    ownerUserId = u?.id ?? null;
  }

  await prisma.promoCode.update({
    where: { id },
    data: {
      code,
      type,
      amount,
      isActive,
      startsAt: startsAt ?? null,
      expiresAt: expiresAt ?? null,
      minOrderCents: minOrderCents ?? null,
      maxUses: maxUses ?? null,
      perUserLimit: perUserLimit ?? null,
      ownerUserId: ownerUserId ?? null,
    },
  });

  revalidatePath("/admin/promos");
  revalidatePath(`/admin/promos/${id}`);
  redirect(`/admin/promos/${id}?saved=1`);
}

async function deletePromo(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({ where: { promoCodeId: id }, data: { promoCodeId: null } });
    await tx.userPromo.deleteMany({ where: { promoId: id } });
    await tx.promoCode.delete({ where: { id } });
  });

  revalidatePath("/admin/promos");
  redirect("/admin/promos?deleted=1");
}

export default async function EditPromoPage({ params, searchParams }: { params: { id: string }, searchParams?: { saved?: string } }) {
  const promo = await prisma.promoCode.findUnique({ 
    where: { id: params.id },
    include: { ownerUser: true }
  });
  if (!promo) notFound();

  const inputClass = "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-amber-500 hover:border-zinc-300";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2 ml-1";

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20">
      
      {/* Шапка и уведомление */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin/promos" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
              <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к списку
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">{promo.code}</h1>
          </div>
        </div>
        {searchParams?.saved === "1" && <SavedToast message="Изменения сохранены" />}
      </div>

      <form action={updatePromo} className="space-y-8">
        <input type="hidden" name="id" value={promo.id} />

        {/* Секция 1: Основное */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-6">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">01</span>
              Базовые параметры
            </h2>
            <label className="flex cursor-pointer items-center gap-3 group">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900">Активен</span>
              <div className="relative">
                <input type="checkbox" name="isActive" className="peer sr-only" defaultChecked={promo.isActive} />
                <div className="h-6 w-11 rounded-full bg-zinc-200 transition-colors peer-checked:bg-emerald-500" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
              </div>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Код</label>
              <input name="code" defaultValue={promo.code} className={`${inputClass} font-mono font-black uppercase`} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Тип</label>
                <select name="type" className={inputClass} defaultValue={promo.type}>
                  <option value="PERCENT">% Процент</option>
                  <option value="FIXED">₽ Фикс</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Размер (Amount)</label>
                <input type="number" min={0} name="amount" defaultValue={promo.amount} className={inputClass} required />
              </div>
            </div>
          </div>
        </section>

        {/* Секция 2: Лимиты */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">02</span>
            Лимиты и статистика
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Мин. сумма (₽)</label>
              <input type="number" min={0} name="minOrderValue" defaultValue={promo.minOrderCents ? promo.minOrderCents / 100 : ""} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>Всего использований</label>
              <input type="number" min={0} name="maxUses" defaultValue={promo.maxUses ?? ""} className={inputClass} placeholder="∞" />
            </div>
            <div>
              <label className={labelClass}>На одного юзера</label>
              <input type="number" min={0} name="perUserLimit" defaultValue={promo.perUserLimit ?? ""} className={inputClass} />
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Текущее использование</p>
              <p className="text-2xl font-black text-zinc-900">
                {promo.usedCount} <span className="text-zinc-300">/</span> {promo.maxUses || "∞"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm ring-1 ring-zinc-200">
              <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Секция 3: Время и Владелец */}
        <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-zinc-200/50 shadow-sm space-y-8">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">03</span>
            Период и Владелец
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Начало</label>
                <input 
                  type="datetime-local" 
                  name="startsAt" 
                  className={inputClass}
                  defaultValue={promo.startsAt ? new Date(promo.startsAt).toISOString().slice(0, 16) : ""}
                />
              </div>
              <div>
                <label className={labelClass}>Окончание</label>
                <input 
                  type="datetime-local" 
                  name="expiresAt" 
                  className={inputClass}
                  defaultValue={promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : ""}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Владелец (Telegram ID)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">@</span>
                <input 
                  name="ownerTgId" 
                  defaultValue={promo.ownerUser?.tgId ?? ""} 
                  className={`${inputClass} pl-10`} 
                  placeholder="ID" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-10 pb-20">
          <DeletePromoButton onDelete={deletePromo} id={promo.id} />

          <div className="flex items-center gap-4">
            <Link href="/admin/promos" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
              Отмена
            </Link>
            <button className="flex h-14 items-center justify-center rounded-full bg-amber-500 px-10 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98]">
              Сохранить изменения
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}