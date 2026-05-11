export const metadata = {
  title: "Гарантия и возврат — EternalTime",
  description: "Условия гарантийного обслуживания, возврата товара надлежащего и ненадлежащего качества.",
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-10">

      {/* Шапка */}
      <header className="space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Покупателям
        </p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
          Гарантия и возврат
        </h1>
        <p className="text-sm text-zinc-500">
          Дата обновления: 11 мая 2026 г.
        </p>
      </header>

      {/* Быстрая навигация */}
      <nav className="grid gap-3 sm:grid-cols-3">
        <a href="#good" className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200/60 transition-all hover:bg-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">01</p>
          <p className="mt-1 text-sm font-bold text-zinc-900">Возврат качественного товара</p>
        </a>
        <a href="#defect" className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200/60 transition-all hover:bg-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">02</p>
          <p className="mt-1 text-sm font-bold text-zinc-900">Гарантия и брак</p>
        </a>
        <a href="#form" className="rounded-2xl bg-zinc-900 p-5 text-white transition-all hover:bg-zinc-800">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">03</p>
          <p className="mt-1 text-sm font-bold">Бланк заявления</p>
        </a>
      </nav>

      {/* 1. ВОЗВРАТ КАЧЕСТВЕННОГО ТОВАРА */}
      <section id="good" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Возврат товара надлежащего качества</h2>
        <p className="text-zinc-700 leading-relaxed">
          Вы можете вернуть товар надлежащего качества в течение <strong>7 календарных дней</strong> с момента получения, купленного в интернет-магазине EternalTime.
        </p>
        <p className="text-zinc-700 leading-relaxed font-semibold">Возврат осуществляется при следующих условиях:</p>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>товар не был в употреблении;</li>
          <li>сохранены потребительские свойства;</li>
          <li>сохранён товарный вид, упаковка, пломбы и документация;</li>
          <li>отсутствуют царапины, потёртости и иные следы эксплуатации.</li>
        </ul>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-900 leading-relaxed">
          <p className="font-bold mb-1">⚠️ Внимательно осматривайте товар при получении</p>
          <p>При обнаружении дефектов, поломки при транспортировке или неполной комплектации — сразу свяжитесь с нами, не подписывая документы о получении без замечаний.</p>
        </div>
        <p className="text-zinc-700 leading-relaxed font-semibold mt-4">Для оформления возврата:</p>
        <ol className="list-decimal pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>Свяжитесь с нами по телефону <a href="tel:+79141720242" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">+7 (914) 172-02-42</a> или на email <a href="mailto:support@eternal-time.online" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">support@eternal-time.online</a>.</li>
          <li>Подготовьте товар в полной комплектации.</li>
          <li>Заполните <a href="/legal/Бланк_возврата_ET.pdf" target="_blank" rel="noopener" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">бланк заявления на возврат</a> и приложите копию паспорта.</li>
          <li>Отправьте товар Почтой России или курьерской службой по адресу, который сообщит наш менеджер.</li>
        </ol>
        <div className="rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/60 p-5 space-y-2 text-sm text-zinc-700 leading-relaxed">
          <p><strong className="text-zinc-900">Возврат средств:</strong> в течение 10 дней с момента получения товара продавцом.</p>
          <p><strong className="text-zinc-900">Стоимость пересылки</strong> при возврате товара надлежащего качества не возмещается.</p>
          <p><strong className="text-zinc-900">Товары со следами эксплуатации</strong> (потёртости, царапины, внешние дефекты) к возврату не принимаются.</p>
        </div>
      </section>

      {/* 2. ВОЗВРАТ НЕНАДЛЕЖАЩЕГО КАЧЕСТВА */}
      <section id="defect" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Возврат товара ненадлежащего качества</h2>
        <p className="text-zinc-700 leading-relaxed">
          Возврат товара ненадлежащего качества осуществляется в соответствии со статьями 18–24 Закона РФ «О защите прав потребителей».
        </p>
        <p className="text-zinc-700 leading-relaxed">
          EternalTime работает только с оригинальной продукцией и обеспечивает гарантийное и постгарантийное обслуживание через авторизованные сервисные центры. Все часы проходят предпродажную проверку по 12 параметрам качества.
        </p>

        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Гарантийный срок</h3>
        <p className="text-zinc-700 leading-relaxed">
          Срок гарантийного обслуживания на часы зависит от бренда и обычно составляет <strong>1–2 года</strong>. Точный срок гарантии указан в карточке товара и в гарантийном талоне, который прилагается к покупке.
        </p>
        <p className="text-zinc-700 leading-relaxed">
          Любые решения по гарантийным случаям принимаются только на основании официального заключения сервисного центра.
        </p>

        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Сроки диагностики</h3>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li><strong>Гарантийный ремонт</strong> — до 45 дней (ст. 20 Закона). По соглашению сторон срок может быть сокращён.</li>
          <li><strong>Замена товара</strong> — до 20 дней с даты обращения (ст. 21 Закона).</li>
          <li><strong>Возврат денежных средств</strong> — до 10 дней со дня заявления требования (ст. 22 Закона).</li>
        </ul>

        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Результат диагностики</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-sm text-emerald-900 leading-relaxed">
            <p className="font-bold mb-2">✓ Заводской брак</p>
            <p>Возвращаем полную стоимость товара включая пересылку, либо заменяем на аналогичный.</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-5 text-sm text-zinc-700 leading-relaxed">
            <p className="font-bold mb-2 text-zinc-900">✗ Брак не подтверждён</p>
            <p>Предложим платный ремонт. Стоимость обратной пересылки в этом случае не возмещается.</p>
          </div>
        </div>

        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Не является гарантийным случаем</h3>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>разрядка элемента питания (батарейки), установленного производителем;</li>
          <li>естественный износ элементов: истирание покрытия корпуса, кнопок, головок, ремешка;</li>
          <li>отклонения точности хода в пределах, указанных в инструкции;</li>
          <li>люфт стрелок в пределах нормы, указанной производителем.</li>
        </ul>

        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Гарантия не распространяется при наличии</h3>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>следов ударов и механических повреждений (вмятины, зазубрины, отскочившие стрелки, деформации);</li>
          <li>следов несанкционированного вскрытия вне гарантийного сервисного центра;</li>
          <li>следов воздействия высоких (выше +50°C) или низких (ниже −20°C) температур;</li>
          <li>повреждений от внешних механических воздействий (разбитое стекло, трещины, сколы);</li>
          <li>повреждений от воздействия влаги при нарушении правил эксплуатации;</li>
          <li>повреждений от химических веществ или растворителей;</li>
          <li>повреждений из-за перевода стрелок календаря в период с 23:00 до 04:00;</li>
          <li>иных повреждений из-за нарушения правил эксплуатации.</li>
        </ul>
      </section>

      {/* 3. БЛАНК ЗАЯВЛЕНИЯ */}
      <section id="form" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Бланк заявления на возврат</h2>
        <div className="rounded-[2rem] bg-zinc-900 text-white p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">PDF документ</p>
              <h3 className="text-xl font-black uppercase tracking-tight">Заявление о возврате денежных средств</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Распечатайте, заполните и приложите к возвращаемому товару. Не забудьте копию паспорта.
              </p>
            </div>
            
            <a
              href="/legal/Бланк_возврата_ET.pdf"
              target="_blank"
              rel="noopener"
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 text-xs font-black uppercase tracking-[0.25em] text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Скачать бланк
            </a>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="space-y-4 rounded-[2rem] bg-zinc-50 p-8 ring-1 ring-zinc-200/60">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Связаться с нами</h2>
        <p className="text-zinc-700 leading-relaxed">
          По всем вопросам гарантийного обслуживания, возврата и обмена обращайтесь в нашу службу поддержки.
        </p>
        <dl className="space-y-2 text-zinc-700">
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Телефон</dt>
            <dd>
              <a href="tel:+79141720242" className="font-semibold text-zinc-900 hover:underline">+7 (914) 172-02-42</a>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Email</dt>
            <dd>
              <a href="mailto:support@eternal-time.online" className="font-semibold text-zinc-900 hover:underline">support@eternal-time.online</a>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Получатель</dt>
            <dd className="text-zinc-900 font-semibold">ИП Соловьев Сергей Сергеевич</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Адрес для отправки</dt>
            <dd className="text-zinc-900">г. Хабаровск, ул. Шатова 8а, кв. 62 <span className="text-zinc-500">(уточняйте у менеджера перед отправкой)</span></dd>
          </div>
        </dl>
      </section>

    </div>
  );
}