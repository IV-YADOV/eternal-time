// app/admin/docs/page.tsx
import Link from "next/link";

/** * ВЕКТОРНЫЕ ИКОНКИ (SVG) 
 * Мы выносим их в константы для чистоты кода и переиспользования
 */
const Icons = {
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Cube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  Image: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.598 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Code: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  Rocket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 3.18a14.98 14.98 0 00-6.16 12.12A14.98 14.98 0 009.63 20.82" />
    </svg>
  )
};

export default function AdminDocsPage() {
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2 block";
  const blockClass = "rounded-[2.5rem] bg-white p-10 ring-1 ring-zinc-200/50 shadow-sm space-y-8";
  const codeBlock = "rounded-2xl bg-zinc-900 p-6 font-mono text-[13px] leading-relaxed text-amber-400 overflow-x-auto shadow-inner";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 space-y-16 pb-32">
      
      {/* 0. INTRO SECTION */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-zinc-100 pb-12">
        <div className="max-w-3xl space-y-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/admin" className="hover:text-zinc-900 transition-colors">EternalTick Admin</Link>
            <span>/</span>
            <span className="text-zinc-900 underline decoration-amber-500 underline-offset-4">Core Documentation</span>
          </nav>
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-7xl">
            Центр управления <br/> <span className="text-zinc-300 italic">EternalTick OS</span>
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed">
            Это полное техническое и операционное руководство по вашей системе. Здесь описаны алгоритмы работы с контентом, товарами и данными, которые обеспечивают премиальный уровень сервиса.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="rounded-full bg-amber-500 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-amber-500/40">
            v0.5.2 Stable Build
          </div>
        </div>
      </section>

      <div className="grid gap-16 lg:grid-cols-12">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32 space-y-10">
            <div>
              <p className={labelClass}>Навигация</p>
              <nav className="space-y-1">
                {[
                  { id: "writing", label: "Контент и Markdown", icon: <Icons.Book /> },
                  { id: "catalog", label: "Каталог товаров", icon: <Icons.Cube /> },
                  { id: "logistics", label: "Заказы и логистика", icon: <Icons.CreditCard /> },
                  { id: "media", label: "Медиа-менеджмент", icon: <Icons.Image /> },
                  { id: "security", label: "Безопасность", icon: <Icons.Shield /> },
                  { id: "dev", label: "Для разработчика", icon: <Icons.Code /> },
                ].map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 group"
                  >
                    <span className="text-zinc-300 group-hover:text-amber-500 transition-colors">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="lg:col-span-9 space-y-24">

          {/* SECTION 1: WRITING */}
          <section id="writing" className="scroll-mt-32 space-y-10">
            <div className={blockClass}>
              <div className="space-y-4">
                <span className={labelClass}>Инструкция по контенту</span>
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Искусство Markdown</h2>
                <p className="text-zinc-600 leading-relaxed max-w-2xl text-lg">
                  Мы отказались от тяжелых визуальных редакторов в пользу Markdown. Это гарантирует, что ваши статьи будут грузиться мгновенно и выглядеть одинаково безупречно на любом устройстве.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-zinc-900">Базовая разметка</h3>
                  <div className={codeBlock}>
                    # Заголовок H1 (Только 1 на статью)<br/>
                    ## Заголовок H2 (Секции)<br/>
                    ### Заголовок H3 (Подсекции)<br/><br/>
                    **Жирный текст** для акцентов<br/>
                    *Курсив* для примечаний<br/>
                    ~~Зачеркнутый~~ (используйте для старых цен)
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-zinc-900">Списки и Ссылки</h3>
                  <div className={codeBlock}>
                    - Маркированный список<br/>
                    1. Нумерованный список<br/><br/>
                    [Текст ссылки](https://site.com)<br/>
                    &gt; Блок цитаты для мнения эксперта<br/><br/>
                    --- (горизонтальный разделитель)
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-amber-50 p-8 border border-amber-100 space-y-4">
                <h4 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <Icons.Shield /> Pro Tip: Структура статьи
                </h4>
                <p className="text-amber-800/80 text-sm leading-relaxed">
                  Поисковые роботы обожают структуру. Всегда начинайте с <code className="bg-white/50 px-1 rounded">H2</code> после вводного абзаца. Не забывайте про поле <strong>Excerpt</strong> — это первые 150 символов, которые человек увидит в Google. Сделайте их кликабельными.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: CATALOG */}
          <section id="catalog" className="scroll-mt-32 space-y-10">
            <div className={blockClass}>
              <div className="space-y-4 text-center lg:text-left">
                <span className={labelClass}>Ассортимент и Данные</span>
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Архитектура каталога</h2>
              </div>

              <div className="grid gap-8">
                {/* Variant Logic */}
                <div className="group relative rounded-3xl bg-zinc-50 p-8 transition-colors hover:bg-zinc-100 border border-zinc-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-200">
                    <Icons.Cube />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">Логика Вариантов (Prisma SKU)</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    В EternalTick один товар может иметь несколько вариаций (цвет, ремешок). Базовая цена всегда тянется из варианта, артикул которого заканчивается на <code className="bg-white px-2 rounded font-bold text-zinc-900">-base</code>.
                  </p>
                  <div className="bg-white rounded-2xl p-4 font-mono text-xs border border-zinc-200">
                    ID: ga-2100-base <br/>
                    ID: ga-2100-red <br/>
                    ID: ga-2100-metal
                  </div>
                </div>

                {/* Specs Logic */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-3xl border border-zinc-200 p-8 space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900">Динамические характеристики</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Поле <code className="font-bold text-zinc-800 italic">Specs</code> хранит данные в формате JSON. Это позволяет нам добавлять любые параметры (водонепроницаемость, тип стекла) без изменения базы данных.
                    </p>
                    <div className="bg-zinc-50 rounded-xl p-4 font-mono text-[11px] text-pink-600">
                      &quot;water_resistance&quot;: &quot;200m&quot;,<br/>
                      &quot;glass&quot;: &quot;Mineral&quot;,<br/>
                      &quot;battery&quot;: &quot;3 years&quot;
                    </div>
                  </div>
                  <div className="rounded-3xl border border-zinc-200 p-8 space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900">Ценообразование</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Все цены в базе хранятся в <strong>центах</strong> (целые числа). При выводе система делит их на 100. Это исключает ошибки округления при расчетах налогов и скидок.
                    </p>
                    <div className="flex items-end gap-2 text-2xl font-black text-amber-500">
                      2499000 <span className="text-zinc-300 text-xs font-medium uppercase tracking-widest pb-1">база</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: LOGISTICS */}
          <section id="logistics" className="scroll-mt-32 space-y-10">
            <div className={blockClass}>
               <div className="space-y-4">
                  <span className={labelClass}>Жизненный цикл сделки</span>
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Заказы и Статусы</h2>
               </div>

               <div className="relative">
                 {/* Visual State Machine */}
                 <div className="hidden lg:flex items-center justify-between mb-12 px-10">
                    {["Новый", "В работе", "Доставка", "Завершен"].map((st, i) => (
                      <div key={st} className="flex flex-col items-center gap-4 z-10">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
                          0{i+1}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{st}</span>
                      </div>
                    ))}
                    <div className="absolute top-5 left-10 right-10 h-[2px] bg-zinc-100 -z-0"></div>
                 </div>

                 <div className="grid gap-6">
                    <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">1</div>
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900">Собирается / В работе</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">На этом этапе менеджер подтверждает наличие. После смены статуса на этот, клиенту уходит письмо о том, что его часы готовятся к отправке.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900">В пути / Ожидает получения</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">Статус для заказов, переданных в СДЭК или Почту. Обязательно вписывайте трек-номер в комментарий (клиент его увидит).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">!</div>
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900">Возврат / Отмена</p>
                        <p className="text-xs text-zinc-500 leading-relaxed text-red-900/60 font-medium italic">Внимание: Отмена заказа автоматически возвращает товар на остатки склада. Не делайте этого, если товар был поврежден.</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </section>

          {/* SECTION 4: MEDIA */}
          <section id="media" className="scroll-mt-32 space-y-10">
            <div className={blockClass}>
              <div className="space-y-4">
                <span className={labelClass}>Хранилище</span>
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Медиа-менеджмент</h2>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="font-bold text-zinc-900">Правило загрузки файлов</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      Система автоматически переименовывает ваши файлы в формат <code className="bg-zinc-100 px-1 rounded text-pink-600">slug-timestamp.ext</code>. Это нужно, чтобы избежать конфликтов имен (например, если два файла называются &quot;photo.jpg&quot;).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-zinc-900">Размеры обложек</p>
                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 marker:text-amber-500">
                      <li>Товары: Квадрат (1:1) или 4:5</li>
                      <li>Блог (Обложка): 16:9</li>
                      <li>Блог (Внутри статьи): Любые</li>
                    </ul>
                  </div>
                </div>
                
                <div className="rounded-[2rem] bg-zinc-900 p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-white font-bold mb-4 relative z-10 flex items-center gap-2">
                    <Icons.Rocket /> Путь к файлу
                  </h3>
                  <p className="text-zinc-500 text-xs mb-6 relative z-10 leading-relaxed">Для вставки фото в текст статьи скопируйте полный путь из раздела редактирования:</p>
                  <code className="block bg-white/5 p-4 rounded-xl text-amber-500 text-xs font-mono relative z-10">
                    ![Описание фото](/uploads/post-slug-1234567.webp)
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: SECURITY */}
          <section id="security" className="scroll-mt-32 space-y-10">
            <div className="rounded-[3rem] bg-zinc-950 p-12 text-white shadow-2xl shadow-zinc-200">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Cybersecurity Layer</span>
                  <h2 className="text-5xl font-black tracking-tight leading-none">Безопасность данных</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    Ваша админка защищена на уровне ядра. Мы используем сессии JWT и хэширование паролей Argon2. Помните: никогда не передавайте логин и пароль в открытом виде в мессенджерах.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">CSRF Protection</div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">Secure Server Actions</div>
                  </div>
                </div>
                <div className="hidden lg:block w-64 h-64 bg-amber-500 rounded-full mix-blend-screen blur-[100px] opacity-20"></div>
              </div>
            </div>
          </section>

          {/* SECTION 6: FOR DEVELOPER */}
          <section id="dev" className="scroll-mt-32 space-y-10">
            <div className={blockClass}>
              <div className="space-y-4">
                <span className={labelClass}>Под капотом</span>
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Технический стек</h2>
              </div>

              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Framework</p>
                    <p className="font-bold text-zinc-900 text-lg">Next.js 14.2</p>
                    <p className="text-[10px] text-zinc-500 italic mt-1">(App Router Architecture)</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">ORM Layer</p>
                    <p className="font-bold text-zinc-900 text-lg">Prisma Engine</p>
                    <p className="text-[10px] text-zinc-500 italic mt-1">(PostgreSQL / Supabase)</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Styling</p>
                    <p className="font-bold text-zinc-900 text-lg">Tailwind CSS</p>
                    <p className="text-[10px] text-zinc-500 italic mt-1">(Utility-First + Headless UI)</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-sm font-black uppercase text-zinc-900">Инвалидация кэша (ISR)</h3>
                   <p className="text-sm text-zinc-500 leading-relaxed max-w-3xl">
                     После редактирования товара или статьи система вызывает <code className="bg-zinc-100 px-1 rounded text-pink-600">revalidatePath()</code>. Это мгновенно обновляет витрину магазина, удаляя старые версии страниц из глобального кэша Vercel. 
                   </p>
                   <div className={codeBlock}>
                    revalidatePath(&apos;/catalog&apos;);<br/>
                    revalidatePath(&apos;/watch/[slug]&apos;, &apos;page&apos;);
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL FOOTER */}
          <footer className="pt-24 border-t border-zinc-100 flex flex-col items-center gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">EternalTick Press.</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic">crafted with precision by YADOV</p>
            </div>
            
            <div className="flex gap-4">
              <a href="https://t.me/yadow" target="_blank" className="h-14 flex items-center justify-center rounded-full bg-zinc-900 px-10 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
                Техподдержка 24/7
              </a>
              <Link href="/" className="h-14 flex items-center justify-center rounded-full border border-zinc-200 bg-white px-10 text-xs font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-50 transition-all">
                Вернуться на витрину
              </Link>
            </div>

            <p className="text-[10px] text-zinc-300 font-medium">
              Copyright © 2026 EternalTick Watch Co. Все права защищены. <br/>
              Использование материалов админ-панели без согласования с владельцем запрещено.
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}