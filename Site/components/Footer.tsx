import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 sm:mt-24 w-full">
      {/* Обертка как в Header: 
        1. container mx-auto - центрирует и задает ту же ширину, что и у <main>
        2. Внутренний div с max-w-[1400px] - для страховки, как в Header 
      */}
      <div className="container mx-auto">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24 font-sans">
          
          {/* Call to Action (VIP панель) */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-12 sm:px-12 sm:py-16 md:flex md:items-center md:justify-between shadow-2xl">
            {/* Свечение */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
              <div className="h-[300px] w-[300px] rounded-full bg-zinc-400/20 blur-[100px] translate-x-1/2" />
            </div>

            <div className="relative z-10 max-w-xl space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Подбор часов</p>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl lg:leading-tight">
                Расскажите, какие эмоции хотите ловить — мы предложим варианты.
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Свяжитесь с нами в удобном мессенджере или просто выберите подходящую модель в каталоге.
              </p>
            </div>
            
            <div className="relative z-10 mt-8 flex shrink-0 flex-col gap-4 sm:flex-row md:mt-0">
              <Link
                href="/catalog"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-zinc-900 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
              >
                Смотреть каталог
              </Link>
              <a
                href="https://t.me/eternaltime24"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                Написать в Telegram
              </a>
            </div>
          </section>

          {/* Навигация */}
          <div className="grid gap-10 pt-8 sm:grid-cols-2 md:grid-cols-4 lg:pt-12">
            
            {/* О компании */}
            <div className="space-y-6">
              <div className="text-2xl font-bold tracking-tight text-zinc-900">
                EternalTime<span className="text-zinc-400">.</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500 pr-4">
                Магазин оригинальных часов на основе параллельного импорта и персонализированным сервисом полного цикла.
              </p>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                © {year} EternalTime
              </p>
            </div>

            <FooterList
              title="Компания"
              links={[
                { href: "/about", label: "О сервисе" },
                { href: "/vacancies", label: "Вакансии" }, // <-- Добавлена ссылка
                { href: "/blog", label: "Журнал" },
                { href: "/catalog", label: "Каталог моделей" },
                { href: "/legal/terms", label: "Пользовательское соглашение" },
                { href: "/legal/offer", label: "Публичная оферта" },
              ]}
            />

            <FooterList
              title="Покупателям"
              links={[
                { href: "/legal/privacy", label: "Политика конфиденциальности" },
                { href: "/legal/cookies", label: "Использование Cookies" },
                { href: "/legal/refund", label: "Гарантия и возврат" },
                { href: "/legal/delivery", label: "Доставка и оплата" },
              ]}
            />

            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Связь
              </div>
              <div className="space-y-3">
                <a className="group flex items-center gap-3 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-500" href="mailto:support@eternal-time.online">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-50 group-hover:text-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  support@eternal-time.online
                </a>
                <a className="group flex items-center gap-3 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-500" href="https://t.me/eternaltime24">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-50 group-hover:text-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z"/>
                      <path d="M22 2 11 13"/>
                    </svg>
                  </span>
                  @eternaltime24  
                </a>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed border-l-2 border-zinc-400 pl-3">
                Работаем ежедневно<br />
                24/7
              </p>
            </div>
          </div>

          {/* Подвал */}
          <div className="flex flex-col items-center gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:justify-between">
            <span className="text-xs font-medium text-zinc-500">
              Code is art. Signed by <span className="text-zinc-900 font-bold">YADOV</span> & EternalTime crew.
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-400"></span>
              </span>
              Build beta 0.3.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="space-y-6">
      <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</div>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link 
              className="group inline-flex items-center text-sm font-medium text-zinc-600 transition-all hover:text-zinc-500" 
              href={link.href}
            >
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}