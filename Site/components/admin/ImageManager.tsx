// components/admin/ImageManager.tsx
"use client";

import { useState } from "react";

export default function ImageManager({ initialImages }: { initialImages: string[] }) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [removed, setRemoved] = useState<string[]>([]);

  // Перемещение изображения
  const move = (index: number, direction: number) => {
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;
    setImages(newImages);
  };

  // Пометить/снять пометку на удаление
  const toggleRemove = (src: string) => {
    setRemoved((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  if (images.length === 0) {
    return <p className="text-sm text-zinc-400 italic">Изображений пока нет</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((src, i) => {
        const isRemoved = removed.includes(src);
        const isFirst = i === 0;
        const isLast = i === images.length - 1;

        return (
          <div
            key={src}
            className={`group relative aspect-square overflow-hidden rounded-3xl bg-zinc-50 ring-1 transition-all ${
              isRemoved
                ? "ring-red-400 opacity-50 grayscale"
                : "ring-zinc-200 hover:ring-amber-400"
            }`}
          >
            {/* Магия здесь: сервер получит массив 'keptImages' ровно в том порядке, 
              в котором инпуты отрендерены в DOM. 
            */}
            {!isRemoved && <input type="hidden" name="keptImages" value={src} />}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />

            {/* Оверлей с кнопками управления */}
            <div className="absolute inset-0 flex flex-col justify-between bg-zinc-900/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={isFirst || isRemoved}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow transition-transform hover:scale-110 disabled:opacity-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={isLast || isRemoved}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow transition-transform hover:scale-110 disabled:opacity-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="mb-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => toggleRemove(src)}
                  className={`flex items-center justify-center rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl transition-transform hover:scale-105 ${
                    isRemoved ? "bg-zinc-800 text-white" : "bg-white text-red-600"
                  }`}
                >
                  {isRemoved ? "Восстановить" : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}