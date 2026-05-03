import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const orderId = searchParams.order;
  
  // Ищем заказ с основными данными
  const order = orderId 
    ? await prisma.order.findUnique({ 
        where: { id: orderId }
      }) 
    : null;

  // Если ID был передан, но заказа нет в базе — 404
  if (orderId && !order) notFound();

  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col items-center text-center">
        
        {/* Анимированная иконка успеха */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-100 opacity-20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-zinc-100">
            <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
          Ваш заказ принят!
        </h1>
        <p className="mt-4 max-w-md text-lg font-medium text-zinc-500 leading-relaxed">
          Благодарим за выбор <span className="text-zinc-900">EternalTime</span>. Мы уже начали подготовку вашей посылки.
        </p>

        {/* Карточка заказа */}
        <div className="mt-12 w-full overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-200/50">
          <div className="grid gap-px bg-zinc-100 sm:grid-cols-2">
            
            {/* Левая часть: Номер и статус */}
            <div className="bg-white p-8 sm:p-10 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Детали заказа</p>
              <h3 className="text-2xl font-black text-zinc-900 uppercase">#{order?.number || "В обработке"}</h3>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
                <span className="text-sm font-bold text-zinc-600">Статус: {order?.status || "Собирается"}</span>
              </div>
            </div>

            {/* Правая часть: Что дальше */}
            <div className="bg-zinc-50/50 p-8 sm:p-10 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Следующий шаг</p>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                Наш менеджер свяжется с вами через <span className="text-zinc-900 font-bold">{order?.contactMethod || "выбранный метод"}</span> для подтверждения деталей доставки.
              </p>
            </div>

          </div>
          
          {/* Нижняя плашка (если есть адрес) */}
          {order?.contactValue && (
             <div className="border-t border-zinc-100 bg-white px-8 py-4 text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Контакт для связи: <span className="text-zinc-900 ml-1">{order.contactValue}</span>
                </p>
             </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link 
            href="/catalog" 
            className="flex h-14 items-center justify-center rounded-full bg-zinc-900 px-10 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-200 transition-all hover:scale-[1.02] hover:bg-zinc-800 active:scale-[0.98]"
          >
            Вернуться в каталог
          </Link>
          <Link 
            href="/blog" 
            className="flex h-14 items-center justify-center rounded-full border border-zinc-200 bg-white px-10 text-sm font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-50"
          >
            Перейти в журнал
          </Link>
        </div>

        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-300">
          Служба поддержки: support@EternalTime.com
        </p>
      </div>
    </div>
  );
}