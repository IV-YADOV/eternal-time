import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-12 text-center font-sans">
      
      {/* Декоративное свечение на фоне */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-50">
        <div className="h-[300px] w-[300px] rounded-full bg-zinc-200/50 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-10">
        
        {/* Блок с цифрами */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Ошибка маршрута
          </p>
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-zinc-900 leading-none drop-shadow-sm">
            404
          </h1>
        </div>
        
        {/* Текстовый блок */}
        <div className="max-w-md space-y-5">
          <h2 className="text-2xl font-black tracking-tight text-zinc-800 md:text-3xl uppercase">
            Время остановилось
          </h2>
          <p className="text-sm font-medium leading-relaxed text-zinc-500">
            Страница, которую вы ищете, была удалена, перемещена или затерялась в механизмах времени. Давайте вернем ход стрелок назад.
          </p>
        </div>

        {/* Кнопки действий (тень убрана) */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
          <Link 
            href="/" 
            className="flex h-14 items-center justify-center rounded-full bg-zinc-900 px-10 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:bg-zinc-800 active:scale-[0.98]"
          >
            На главную
          </Link>
          <Link 
            href="/catalog" 
            className="flex h-14 items-center justify-center rounded-full border border-zinc-200 bg-transparent px-10 text-sm font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            В каталог
          </Link>
        </div>

      </div>
    </div>
  );
}