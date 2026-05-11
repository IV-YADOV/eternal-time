export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Reveal from "@/components/Reveal"; // Убедитесь, что путь совпадает с вашим

export const dynamic = "force-dynamic";

const HERO_IMAGE = "https://i.imgur.com/Y0bjpoA.jpeg";

function buildImgSrc(u: string) {
  const safe = encodeURI(u);
  const isAbsolute = /^https?:\/\//i.test(safe);
  return isAbsolute ? `${safe}?auto=format&fit=crop&w=1200&q=60` : safe;
}

export default async function Home() {
  const brandsRaw = await prisma.brand.findMany({
    include: {
      _count: { select: { products: true } },
      products: {
        where: { isArchived: false },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { images: true, slug: true, name: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const desiredOrder = ["g-shock", "baby-g", "pro-trek", "edifice"];
  const brands = brandsRaw.sort((a, b) => {
    const ia = desiredOrder.indexOf(a.slug);
    const ib = desiredOrder.indexOf(b.slug);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb || a.name.localeCompare(b.name);
  });

  const brandDescriptions: Record<string, string> = {
    "g-shock": "Несокрушимая легенда для экстремальных условий",
    "baby-g": "Элегантная прочность в компактном корпусе",
    "pro-trek": "Ваш проводник в мире дикой природы",
    "edifice": "Интеллектуальная эстетика и скорость",
  };

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24 font-sans">
      
      {/* 1. CINEMATIC HERO SECTION (С ПАРАЛЛАКСОМ) */}
      {/* Добавлен clip-path, чтобы параллакс не вылезал за скругленные края */}
      <section 
        className="group relative h-[75vh] sm:h-[80vh] lg:h-[85vh] w-full bg-zinc-950 rounded-[2.5rem] sm:rounded-[3.5rem] mt-4 shadow-2xl"
        style={{ clipPath: "inset(0 0 0 0 round 2.5rem)" }}
      >
        {/* Картинка приклеена (fixed) внутри секции для эффекта параллакса */}
        <div className="absolute inset-0 h-full w-full" style={{ clipPath: "inset(0)" }}>
          <img
            src={HERO_IMAGE}
            alt="EternalTime Premium Collection"
            className="fixed left-0 top-0 h-[100vh] w-full object-cover opacity-60 transition-transform duration-[20000ms] ease-linear group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <Reveal>
            <h1 className="max-w-5xl text-4xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl xl:text-9xl uppercase leading-[1.1] sm:leading-[1.05]">
              {/* Заголовок */}
            </h1>
          </Reveal>
          
          <Reveal delay={0.1}>
            <p className="mt-6 sm:mt-8 max-w-2xl text-base font-medium text-zinc-400 sm:text-xl px-4 leading-relaxed">
              Персональный подбор, диагностика и пожизненный сервис <br className="hidden lg:block" /> культовых японских моделей.
            </p>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="mb-10 mt-10 sm:mt-12 flex flex-col gap-4 w-full sm:w-auto sm:flex-row pb-12 sm:pb-0">
              <Link 
                href="/catalog" 
                className="flex h-14 sm:h-16 items-center justify-center rounded-full bg-white px-12 text-sm font-black uppercase tracking-widest text-zinc-900 transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
              >
                В каталог
              </Link>
              <Link 
                href="/about" 
                className="flex h-14 sm:h-16 items-center justify-center rounded-full border border-white/20 bg-white/5 px-12 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 active:scale-95"
              >
                Философия
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 grid-cols-3 gap-16 lg:grid">
          {[
            { v: "100%", l: "Оригинал" },
            { v: "0 фейков", l: "Проверено" },
            { v: "Япония", l: "Напрямую" }
          ].map((s, i) => (
            <Reveal key={s.l} delay={0.3 + (i * 0.1)}>
              <div className="text-center group/stat cursor-default">
                <p className="text-2xl font-black text-white transition-all duration-500 group-hover/stat:-translate-y-2 group-hover/stat:text-zinc-300 group-hover/stat:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  {s.v}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1 transition-all duration-500 group-hover/stat:text-zinc-400">
                  {s.l}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2. COLLECTIONS */}
      <Reveal>
        <section className="space-y-10 sm:space-y-12">
          <div className="flex items-end justify-between border-b border-zinc-100 pb-6 sm:pb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Линейки</p>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-6xl uppercase">Коллекции</h2>
            </div>
            <Link href="/catalog" className="group flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
              Все 
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {brands.map((b, idx) => {
  const images = (b.products[0]?.images as string[]) || [];
  const firstImg = images[0] || "https://picsum.photos/600/800";
  return (
    <Reveal key={b.id} delay={idx * 0.1}>
      <Link
        href={`/catalog?brand=${encodeURIComponent(b.slug)}`}
        /* Изменили фон на более светлый bg-zinc-50 для лучшего эффекта blend */
        className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-zinc-50 shadow-sm transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-3 isolation-isolate"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute inset-0 z-20 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[150%]" />

        {/* ОСНОВНЫЕ ИЗМЕНЕНИЯ ТУТ:
            1. object-contain — чтобы часы были видны целиком.
            2. p-6 или p-8 — добавляем "воздух" вокруг товара.
            3. mix-blend-multiply — убираем белый фон фото.
        */}
        <img
          src={buildImgSrc(String(firstImg))}
          alt={b.name}
          className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10 mix-blend-multiply transition-transform duration-[2000ms] ease-out group-hover:scale-110"
        />

        {/* Градиент для текста делаем чуть менее агрессивным снизу (from-zinc-950/80), 
            чтобы он не слишком сильно затемнял нижнюю часть "бленднутого" фото */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
        
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter transition-transform duration-500 group-hover:-translate-y-1">{b.name}</h3>
          <p className="mt-2 text-[10px] sm:text-xs font-medium text-white line-clamp-2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {brandDescriptions[b.slug] || "Премиальное качество и надежность"}
          </p>
          
          <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {b._count.products} моделей
            </span>
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-zinc-900">
              <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
})}
          </div>
        </section>
      </Reveal>

      {/* 3. DARK WORKFLOW SECTION */}
      <Reveal>
        <section className="bg-zinc-900 rounded-[2.5rem] sm:rounded-[3.5rem] px-6 py-16 sm:py-24 lg:px-16 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-20 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute bottom-10 left-10 w-64 h-64 bg-zinc-500 opacity-20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
            <div className="space-y-6 sm:space-y-8 text-white text-center lg:text-left">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none">
                Как мы создаем <br /> <span className="text-zinc-400">ваш стиль</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                От первой консультации до момента, когда вы надеваете часы — мы обеспечиваем безупречный путь.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { s: "01", t: "Подбор", d: "Анализируем ваш образ жизни и задачи." },
                { s: "02", t: "Проверка", d: "Каждый экземпляр проходит 12 тестов." },
                { s: "03", t: "Доставка", d: "Бронированная упаковка и страховка." },
                { s: "04", t: "Сервис", d: "Пожизненная чистка и калибровка." },
              ].map((step, idx) => (
                <Reveal key={step.s} delay={idx * 0.1}>
                  <div className="h-full rounded-[1.5rem] sm:rounded-[2rem] bg-white/5 p-6 sm:p-8 border border-white/5 transition-all duration-500 group hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)]">
                    <span className="inline-block text-xs sm:text-sm font-black text-zinc-500 transition-all duration-500 group-hover:text-white group-hover:tracking-[0.2em] group-hover:scale-110 group-hover:rotate-[-5deg] uppercase">
                      {step.s}
                    </span>
                    <h3 className="mt-4 text-lg sm:text-xl font-bold text-white uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-1">{step.t}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium transition-colors duration-300 group-hover:text-zinc-400">{step.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 4. MAGAZINE SECTION */}
      <Reveal>
        <section className="space-y-10 sm:space-y-12">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-6 sm:pb-8">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">Журнал</h2>
            <Link href="/blog" className="group flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
              Все статьи 
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, idx) => {
              const images = (p.images as string[]) || [];
              const img = images[0] || "https://picsum.photos/800/500";
              return (
                <Reveal key={p.id} delay={idx * 0.1}>
                  <Link href={`/blog/${p.slug}`} className="group flex flex-col space-y-4 sm:space-y-6 h-full">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-zinc-100 shadow-sm ring-1 ring-zinc-200/50 isolation-isolate transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2" style={{ transform: 'translateZ(0)' }}>
                      <img
                        src={buildImgSrc(String(img))}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-zinc-900/80 px-4 py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-zinc-900">
                          Article
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3 px-1 sm:px-2 flex-1">
                      <time className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors duration-300 group-hover:text-zinc-600">
                        {new Date(p.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                      </time>
                      <h3 className="text-xl sm:text-2xl font-black leading-[1.2] text-zinc-900 transition-colors duration-300 group-hover:text-zinc-500 line-clamp-2 uppercase tracking-tight">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* 5. NEWSLETTER */}
      <Reveal>
        <section className="pb-10">
          <div className="group relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] bg-zinc-900 px-6 py-16 sm:py-24 text-center text-white shadow-2xl transition-all duration-700 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white opacity-5 blur-[80px] transition-all duration-1000 group-hover:scale-150 group-hover:opacity-10 group-hover:animate-pulse" />
            
            <h2 className="relative z-10 text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] transition-transform duration-500 group-hover:scale-[1.02]">
              Станьте частью <br /> <span className="text-zinc-400">сообщества</span>
            </h2>
            <p className="relative z-10 mt-6 text-sm sm:text-lg text-zinc-400 max-w-md mx-auto font-medium px-4 leading-relaxed">
              Получайте уведомления о редких поступлениях и закрытых предпродажах G-Shock.
            </p>
            
            <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4">
              <input 
                type="email" 
                placeholder="vash-email@mail.ru" 
                className="h-14 sm:h-16 w-full max-w-sm rounded-full bg-white/5 border border-white/10 px-8 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-white focus:ring-4 focus:ring-white/10 text-center sm:text-left font-bold placeholder:text-zinc-600 hover:border-white/30"
              />
              <button className="h-14 sm:h-16 w-full sm:w-auto rounded-full bg-white px-10 text-sm font-black uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 shadow-lg shadow-white/5">
                Подписаться
              </button>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}