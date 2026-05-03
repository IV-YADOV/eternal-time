"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// Минималистичные векторные иконки (SVG)
const Icons = {
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Expand: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 3 6 6-6-6ZM9 21l-6-6 6 6Z"/><path d="M21 3v6h-6M3 21v-6h6"/></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  )
};

export default function ProductGallery({ images }: { images: string[] }) {
  // Заглушка, если нет фото
  const pics = useMemo(
    () => (Array.isArray(images) && images.length ? images : ["https://i.imgur.com/E8Y4r7j.png"]), 
    [images]
  );

  const [idx, setIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setIdx((n) => (n - 1 + pics.length) % pics.length), [pics.length]);
  const next = useCallback(() => setIdx((n) => (n + 1) % pics.length), [pics.length]);
  
  // Обработка движения мыши для Zoom-эффекта
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Блокировка скролла при открытом фуллскрине
  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKey);
    };
  }, [fullscreen, next, prev]);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* ГЛАВНОЕ ОКНО ГАЛЕРЕИ */}
        <div 
          ref={containerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setFullscreen(true)}
          /* ЭФФЕКТ: Слегка серый фон, который становится белым при наведении, заставляя часы "всплывать" */
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-[3rem] bg-white ring-1 ring-zinc-200 transition-all duration-700 ease-in-out hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
        >
          {/* Кнопки навигации (появляются при наведении) */}
          {pics.length > 1 && (
            <div className="absolute inset-x-5 top-1/2 z-30 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button 
                onClick={(e) => { e.stopPropagation(); prev(); }} 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Назад"
              >
                <Icons.ChevronLeft />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); next(); }} 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Вперед"
              >
                <Icons.ChevronRight />
              </button>
            </div>
          )}

          {/* Кнопка развертывания */}
          {/* <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
            className="absolute right-6 top-6 z-30 flex h-10 items-center gap-2.5 rounded-full bg-zinc-900/5 px-5 text-[10px] font-black uppercase tracking-widest text-zinc-900 backdrop-blur-md transition hover:bg-zinc-900 hover:text-white"
          >
            <Icons.Expand />
            Full view
          </button> */}

          {/* КОНТЕЙНЕР ДЛЯ ZOOM-ЭФФЕКТА */}
          <div 
            className="h-full w-full overflow-hidden transition-transform duration-500 ease-out"
            style={{
              // Небольшое общее увеличение контейнера при ховере
              transform: isHovering ? 'scale(1.01)' : 'scale(1)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${pics[idx]}?auto=format&fit=max&w=1600&q=90`}
              alt={`Часы EternalTime - фото ${idx + 1}`}
              /* ВАЖНО: 
                 1. object-contain — чтобы часы были видны целиком.
                 2. p-12 — большой padding, чтобы часы были аккуратно вписаны.
                 3. mix-blend-multiply — МАГИЯ: идеально белый фон становится прозрачным.
              */
              className="h-full w-full object-contain p-12 mix-blend-multiply transition-transform duration-150 ease-out"
              style={{
                // Ключевая магия Zoom-эффекта: увеличение в точке курсора
                transform: isHovering ? `scale(2.2)` : `scale(1)`,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* ЛЕНТА МИНИАТЮР */}
        {pics.length > 1 && (
          <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar">
            {pics.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                  i === idx 
                    ? "border-zinc-900 bg-white shadow-lg" 
                    : "border-transparent bg-zinc-100 opacity-70 hover:opacity-100 hover:bg-zinc-200/50"
                }`}
                aria-label={`Переключить на фото ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`${src}?auto=format&fit=max&w=200&q=60`} 
                  /* Применяем mix-blend-multiply и к миниатюрам */
                  className="h-full w-full object-contain p-3 mix-blend-multiply" 
                  alt="Миниатюра" 
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ПОЛНОЭКРАННЫЙ МОДАЛ (Glassmorphism) */}
      {fullscreen && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/90 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={() => setFullscreen(false)} // Закрытие при клике на фон
        >
          {/* Шапка модала */}
          <div className="flex items-center justify-between p-6" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              EternalTime / View — {idx + 1} / {pics.length}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white hover:text-zinc-950"
              aria-label="Закрыть"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Основное изображение во весь экран */}
          <div className="relative flex flex-1 items-center justify-center px-10" onClick={(e) => e.stopPropagation()}>
            {pics.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-10 z-10 hidden h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white hover:text-zinc-900 lg:flex">
                  <Icons.ChevronLeft />
                </button>
                <button onClick={next} className="absolute right-10 z-10 hidden h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white hover:text-zinc-900 lg:flex">
                  <Icons.ChevronRight />
                </button>
              </>
            )}
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${pics[idx]}?auto=format&fit=max&w=2400&q=100`}
              /* ЭФФЕКТ: Белая тень, чтобы часы "светились" на темном фоне */
              className="max-h-[80vh] w-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              alt="Часы крупным планом"
            />
          </div>

          {/* Миниатюры снизу (в модале) */}
          {pics.length > 1 && (
            <div className="flex justify-center gap-3.5 p-10" onClick={(e) => e.stopPropagation()}>
               {pics.map((src, i) => (
                  <button
                    key={`full-${i}`}
                    onClick={() => setIdx(i)}
                    className={`h-18 w-18 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      i === idx 
                        ? "border-white scale-110 shadow-2xl" 
                        : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`${src}?auto=format&fit=max&w=200`} 
                      /* Товарные фото с белым фоном на темном фоне фуллскрина выглядят грязновато.
                         mix-blend-multiply здесь не сработает (он уберет белый и оставит часы темными на темном).
                         Лайфхак: Инвертируем изображение, делая белое черным, а темное часы светлыми.
                      */
                      className="h-full w-full object-contain p-2 invert brightness-150" 
                      alt="Миниатюра фуллскрин" 
                    />
                  </button>
               ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}