// app/about/page.tsx
export const metadata = {
  title: "О сервисе — EternalTime",
  description:
    "EternalTime — молодой проект с Дальнего Востока. Привозим оригинальные японские часы без наценок крупных сетей. Честный сервис и индивидуальный подход.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-20 lg:space-y-24">
      
      {/* Шапка */}
      <section className="space-y-6 text-center max-w-3xl mx-auto">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">О сервисе</p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          Честный подход к <span className="text-zinc-400">вашему времени.</span>
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
          Мы — молодой проект. У нас (пока) нет тысяч отзывов и огромных корпоративных офисов. Но у нас есть страсть к часам, прямые выходы на поставщиков и желание делать свою работу на 100% честно.
        </p>
      </section>

      {/* Миссия и подход (2 колонки) */}
      <section className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="rounded-[2rem] bg-zinc-50 p-8 sm:p-10 ring-1 ring-zinc-200/60 transition-all hover:bg-white hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Наша цель</h2>
          <p className="text-zinc-600 leading-relaxed">
            Доказать, что качественные оригинальные часы можно покупать без гигантских наценок крупных ритейлеров. Мы делаем ставку на прозрачность, а не на агрессивный маркетинг.
          </p>
        </div>

        <div className="rounded-[2rem] bg-zinc-50 p-8 sm:p-10 ring-1 ring-zinc-200/60 transition-all hover:bg-white hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Наш козырь — география</h2>
          <p className="text-zinc-600 leading-relaxed">
            Проект зародился на Дальнем Востоке. Близость к азиатским рынкам позволяет нам выстраивать прямую логистику с дилерами Японии и Китая. Меньше посредников — честнее цена для вас.
          </p>
        </div>
      </section>

      {/* Цифры и факты (Адаптировано под стартап) */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Почему с нами надежно</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Работа на имя",
              text: "Мы только начинаем свой путь, поэтому каждый клиент для нас — главный. Ваша рекомендация важнее сиюминутной прибыли.",
              icon: "🤝",
            },
            {
              title: "Только оригинал",
              text: "Никаких реплик и копий. Любые часы можно проверить на подлинность до оплаты заказа.",
              icon: "🛡️",
            },
            {
              title: "Прямой диалог",
              text: "Вы общаетесь не с ботами или скриптованным колл-центром, а напрямую с создателями проекта.",
              icon: "💬",
            },
            {
              title: "Ручная проверка",
              text: "Перед отправкой мы лично вскрываем, проверяем механизм, комплектность и надежно упаковываем каждую коробку.",
              icon: "👁️",
            },
          ].map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-[2rem] bg-white p-8 ring-1 ring-zinc-200 transition-all hover:shadow-lg hover:ring-zinc-300">
              <div className="absolute -right-4 -top-4 text-8xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05] grayscale">
                {item.icon}
              </div>
              <p className="relative text-2xl font-bold text-zinc-900 mb-2">{item.title}</p>
              <p className="relative text-sm text-zinc-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ценности */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-center">Никаких скрытых условий</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Прозрачность цен",
              text: "Цена в каталоге — финальная. Мы сразу говорим, что есть в наличии, а что нужно немного подождать под заказ.",
            },
            {
              title: "Видео-отчеты",
              text: "По вашему запросу снимем видео конкретно ваших часов перед отправкой со всех ракурсов.",
            },
            {
              title: "Поддержка после",
              text: "Сделка не заканчивается в момент оплаты. Поможем настроить, подскажем по функционалу и обслуживанию.",
            },
          ].map((value) => (
            <div key={value.title} className="rounded-[2rem] bg-zinc-900 p-8 text-white">
              <p className="text-xl font-bold mb-3">{value.title}</p>
              <p className="text-zinc-400 leading-relaxed">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* История (Timeline - Реальная) */}
      <section className="space-y-10 py-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">С чего всё началось</h2>
        </div>
        
        <div className="relative mx-auto max-w-2xl pl-6 sm:pl-0">
          {/* Линия */}
          <div className="absolute bottom-0 left-[27px] top-0 w-px bg-zinc-200 sm:left-1/2 sm:-ml-px" />
          
          <div className="space-y-12">
            {[
              {
                year: "Идея",
                title: "От увлечения к делу",
                text: "Поняли, что на рынке много подделок и перекупщиков с безумными наценками. Решили, что можем привозить оригинальные G-Shock и другие японские бренды честнее.",
              },
              {
                year: "Поиск",
                title: "Наладка контактов",
                text: "Изучили цепочки поставок, нашли надежных поставщиков в Азии и протестировали первые заказы на себе и друзьях.",
              },
              {
                year: "Запуск",
                title: "Старт EternalTime",
                text: "Написали код этого сайта с нуля, собрали первую коллекцию и открыли двери для всех, кто ценит время и стиль.",
              },
            ].map((item, idx) => (
              <div key={item.year} className={`relative flex flex-col sm:flex-row items-start ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="absolute left-[-23px] sm:left-1/2 sm:-ml-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white ring-4 ring-zinc-100 z-10 mt-1">
                  <div className="h-2 w-2 rounded-full bg-zinc-400" />
                </div>
                
                <div className={`w-full sm:w-[calc(50%-3rem)] ${idx % 2 === 0 ? 'sm:text-left' : 'sm:text-right'}`}>
                  <span className="text-sm font-bold tracking-widest text-zinc-400">{item.year}</span>
                  <h3 className="text-xl font-bold text-zinc-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Кто за этим стоит</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Здесь нет стоковых фотографий людей в пиджаках. За проектом стоят живые энтузиасты.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Лошара 1",
              role: "Логистика и Закупки",
            },
            {
              name: "Лошара 2",
              role: "Клиентский Сервис",
            },
            {
              name: "Иван",
              role: "IT Инфраструктура",
            },
            {
              name: "Дмитрий",
              role: "Коммуникации и Контент",
            },
          ].map((member) => (
            <article key={member.name} className="flex flex-col items-center text-center rounded-[2rem] bg-white p-8 ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-zinc-300">
              {/* Заглушка для фото */}
              <div className="mb-5 h-28 w-28 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-100 transition-all group-hover:ring-zinc-300">
                <img 
                  src="https://placehold.co/400x400/f4f4f5/a1a1aa?text=Photo" 
                  alt={member.name} 
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{member.name}</h3>
              <p className="text-sm font-medium text-zinc-500">{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Отзывы */}
      <section className="space-y-8">
        <div className="rounded-[3rem] bg-zinc-50 p-8 sm:p-12 ring-1 ring-zinc-200/60 text-center max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
            <div className="h-[200px] w-[300px] rounded-full bg-white blur-[80px]" />
          </div>

          <h2 className="relative z-10 text-3xl font-bold tracking-tight text-zinc-900 mb-4">Здесь будут ваши отзывы</h2>
          <p className="relative z-10 text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
            Мы только начинаем формировать наше комьюнити. Станьте одними из первых клиентов EternalTime и убедитесь в качестве нашей работы лично. Ваш честный отзыв — лучшая награда для нас.
          </p>
          <a
            href="https://t.me/eternalTime"
            className="relative z-10 inline-flex h-14 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-bold text-white transition-all hover:scale-[1.02] hover:bg-zinc-800 active:scale-[0.98]"
          >
            Написать нам
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-center">Частые вопросы</h2>
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {[
            {
              q: "Откуда едут часы?",
              a: "Большинство моделей мы привозим со складов надежных дилеров из стран Азии. Близость к Дальнему Востоку позволяет нам обходить наценки локальных дистрибьюторов.",
            },
            {
              q: "Как проверить оригинальность?",
              a: "Все часы поставляются в заводских коробках, с оригинальными бирками и документацией. Вы можете проверить все гравировки и серийные номера при получении.",
            },
            {
              q: "Что с доставкой?",
              a: "Отправляем надежными транспортными компаниями (СДЭК/Почта). Трек-номер выдаем сразу после передачи посылки в доставку.",
            },
          ].map((item) => (
            <details key={item.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-zinc-900 text-lg">
                {item.q}
                <span className="ml-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-200">
                  <svg className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 leading-relaxed pr-10 animate-in fade-in slide-in-from-top-2 duration-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Финальный Call-to-action (CTA) */}
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-950 px-6 py-16 text-center sm:px-16 sm:py-24 shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="h-[300px] w-[500px] rounded-full bg-zinc-400/20 blur-[100px]" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">С чего начнем?</h2>
          <p className="text-lg leading-relaxed text-zinc-300">
            Даже если вы просто присматриваетесь или хотите задать пару вопросов по конкретной модели — смело пишите. Мы всегда рады пообщаться о часах.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://t.me/eternalTime"
              className="flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              Перейти в Telegram
            </a>
          </div>
          
          <div className="pt-8 text-zinc-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a href="mailto:support@eternalTime.store" className="hover:text-white transition-colors">📧 support@eternalTime.store</a>
            <a href="https://t.me/eternalTime" className="hover:text-white transition-colors">💬 @eternalTime</a>
          </div>
        </div>
      </section>

    </div>
  );
}