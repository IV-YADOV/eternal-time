export const metadata = {
  title: "Политика конфиденциальности — EternalTime",
  description: "Как мы собираем, используем и храним персональные данные пользователей сайта eternal-time.online.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-10">

      {/* Шапка */}
      <header className="space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Правовая информация
        </p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
          Политика обработки персональных данных
        </h1>
        <p className="text-sm text-zinc-500">
          Дата последнего обновления: 10.05.2026
        </p>
      </header>

      {/* Преамбула */}
      <section className="space-y-4 text-zinc-700 leading-relaxed">
        <p>
          Настоящая Политика обработки персональных данных (далее — «Политика») действует в отношении информации, которую Индивидуальный предприниматель Соловьев Сергей Сергеевич (далее — «Оператор») получает о пользователях сайта{" "}
          <a href="https://eternal-time.online/" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">
            https://eternal-time.online/
          </a>{" "}
          и покупателях интернет-магазина EternalTime.
        </p>
      </section>

      {/* 1. ОБЩИЕ ПОЛОЖЕНИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">1. Общие положения</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>1.1. Политика составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет цели, состав, порядок и условия обработки персональных данных.</p>
          <p>1.2. Оператор: Индивидуальный предприниматель Соловьев Сергей Сергеевич, ОГРНИП 325270000040020, ИНН 790153027990, адрес: г. Хабаровск, ул. Шатова 8а, кв. 62, телефон: +7 (914) 172-02-42.</p>
          <p>1.3. Использование Сайта и передача персональных данных через формы Сайта, по телефону, электронной почте, в мессенджерах или иными способами означает, что Пользователь ознакомлен с настоящей Политикой.</p>
          <p>1.4. Если Пользователь не согласен с условиями Политики, он должен воздержаться от передачи персональных данных через Сайт.</p>
        </div>
      </section>

      {/* 2. ОСНОВНЫЕ ПОНЯТИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">2. Основные понятия</h2>
        <dl className="space-y-3 text-zinc-700 leading-relaxed pl-4 border-l-2 border-zinc-200">
          <div>
            <dt className="font-bold text-zinc-900 inline">Персональные данные</dt>
            <dd className="inline"> — любая информация, относящаяся прямо или косвенно к определённому или определяемому физическому лицу.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Обработка персональных данных</dt>
            <dd className="inline"> — любое действие или совокупность действий с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение, использование, передачу, обезличивание, блокирование, удаление и уничтожение.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Пользователь</dt>
            <dd className="inline"> — лицо, использующее Сайт или передающее Оператору персональные данные.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Оператор</dt>
            <dd className="inline"> — лицо, самостоятельно или совместно с другими лицами организующее и осуществляющее обработку персональных данных, а также определяющее цели и состав обрабатываемых персональных данных.</dd>
          </div>
        </dl>
      </section>

      {/* 3. СОСТАВ ДАННЫХ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">3. Состав обрабатываемых данных</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>3.1. Оператор может обрабатывать следующие персональные данные Пользователя: фамилию, имя, отчество; номер телефона; адрес электронной почты; адрес доставки; сведения о заказе; историю обращений и переписки; иные сведения, которые Пользователь добровольно сообщает Оператору.</p>
          <p>3.2. Оператор не обрабатывает специальные категории персональных данных, касающиеся расовой или национальной принадлежности, политических взглядов, религиозных или философских убеждений, состояния здоровья, интимной жизни, если Пользователь сам не предоставит такие сведения без запроса Оператора.</p>
          <p>3.3. При использовании Сайта могут автоматически обрабатываться технические данные: IP-адрес, сведения о браузере и устройстве, дата и время посещения, адреса просмотренных страниц, файлы cookie и аналогичные технологии. Такие данные используются для работы Сайта, аналитики и улучшения сервиса с учётом требований законодательства.</p>
        </div>
      </section>

      {/* 4. ЦЕЛИ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">4. Цели обработки персональных данных</h2>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>оформление, подтверждение, исполнение, доставка и возврат заказов;</li>
          <li>связь с Пользователем по вопросам заказа, оплаты, доставки, гарантии, возврата и поддержки;</li>
          <li>заключение и исполнение договоров с Пользователем;</li>
          <li>обработка обращений, претензий, отзывов и запросов Пользователя;</li>
          <li>исполнение требований законодательства Российской Федерации;</li>
          <li>направление информационных и рекламных сообщений при наличии соответствующего согласия Пользователя;</li>
          <li>анализ работы Сайта, повышение качества сервиса, обеспечение безопасности и предотвращение злоупотреблений.</li>
        </ul>
      </section>

      {/* 5. ПРАВОВЫЕ ОСНОВАНИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">5. Правовые основания обработки</h2>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>согласие Пользователя на обработку персональных данных;</li>
          <li>заключение и исполнение договора с Пользователем;</li>
          <li>исполнение обязанностей, возложенных на Оператора законодательством Российской Федерации;</li>
          <li>законный интерес Оператора в обеспечении работы Сайта, обработке обращений, защите прав и предотвращении злоупотреблений, если такой интерес не нарушает права и свободы Пользователя.</li>
        </ul>
      </section>

      {/* 6. ПОРЯДОК И УСЛОВИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">6. Порядок и условия обработки</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>6.1. Оператор обрабатывает персональные данные с использованием средств автоматизации и без использования таких средств.</p>
          <p>6.2. Персональные данные хранятся не дольше, чем этого требуют цели обработки, договорные отношения, сроки исковой давности, бухгалтерские и иные обязательные сроки хранения, установленные законодательством Российской Федерации.</p>
          <p>6.3. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения и иных неправомерных действий.</p>
          <p>6.4. Оператор не раскрывает персональные данные третьим лицам и не распространяет их без согласия Пользователя, за исключением случаев, предусмотренных законодательством Российской Федерации или необходимых для исполнения договора с Пользователем.</p>
        </div>
      </section>

      {/* 7. ПЕРЕДАЧА ТРЕТЬИМ ЛИЦАМ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">7. Передача персональных данных третьим лицам</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>7.1. Для достижения целей обработки Оператор может поручать обработку персональных данных или передавать необходимые данные службам доставки, платёжным сервисам, операторам связи, поставщикам хостинга, CRM-сервисам, сервисам аналитики, консультантам, а также иным лицам, участвующим в исполнении заказа, работе Сайта или выполнении требований закона.</p>
          <p>7.2. Третьим лицам передаётся только объём данных, необходимый для конкретной цели обработки.</p>
          <p>7.3. При поручении обработки персональных данных Оператор принимает меры для обеспечения конфиденциальности и безопасности персональных данных.</p>
        </div>
      </section>

      {/* 8. ПРАВА ПОЛЬЗОВАТЕЛЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">8. Права пользователя</h2>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>получать информацию об обработке своих персональных данных;</li>
          <li>требовать уточнения, блокирования или уничтожения персональных данных, если они являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки;</li>
          <li>отозвать согласие на обработку персональных данных;</li>
          <li>возражать против обработки персональных данных в случаях, предусмотренных законодательством;</li>
          <li>обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных или в суд.</li>
        </ul>
      </section>

      {/* 9. ОТЗЫВ СОГЛАСИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">9. Отзыв согласия и обращения</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>
            9.1. Пользователь вправе отозвать согласие на обработку персональных данных, направив Оператору соответствующее обращение по контактам, указанным на Сайте, либо по адресу Оператора. Также обращение можно направить на email{" "}
            <a href="mailto:support@eternal-time.online" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">
              support@eternal-time.online
            </a>.
          </p>
          <p>9.2. После получения отзыва согласия Оператор прекращает обработку персональных данных, если отсутствуют иные законные основания для продолжения обработки, например необходимость исполнения договора, требований законодательства или защиты прав Оператора.</p>
          <p>9.3. Обращение должно позволять идентифицировать Пользователя и содержать сведения, необходимые для рассмотрения запроса.</p>
        </div>
      </section>

      {/* 10. ЗАКЛЮЧИТЕЛЬНЫЕ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">10. Заключительные положения</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>10.1. Оператор вправе изменять настоящую Политику. Актуальная редакция размещается на Сайте.</p>
          <p>10.2. Настоящая Политика применяется только к Сайту Оператора и не распространяется на сайты третьих лиц, на которые Пользователь может перейти по ссылкам с Сайта.</p>
        </div>
      </section>

      {/* РЕКВИЗИТЫ */}
      <section className="space-y-4 rounded-[2rem] bg-zinc-50 p-8 ring-1 ring-zinc-200/60">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Реквизиты Оператора</h2>
        <dl className="space-y-2 text-zinc-700">
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Правовая форма</dt>
            <dd className="font-semibold text-zinc-900">Индивидуальный предприниматель Соловьев Сергей Сергеевич</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">ОГРНИП</dt>
            <dd className="font-mono text-zinc-900">325270000040020</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">ИНН</dt>
            <dd className="font-mono text-zinc-900">790153027990</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Адрес</dt>
            <dd className="text-zinc-900">г. Хабаровск, ул. Шатова 8а, кв. 62</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Телефон</dt>
            <dd>
              <a href="tel:+79141720242" className="text-zinc-900 hover:underline">+7 (914) 172-02-42</a>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Email</dt>
            <dd>
              <a href="mailto:support@eternal-time.online" className="text-zinc-900 hover:underline">support@eternal-time.online</a>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Сайт</dt>
            <dd>
              <a href="https://eternal-time.online" className="text-zinc-900 hover:underline">eternal-time.online</a>
            </dd>
          </div>
        </dl>
      </section>

    </div>
  );
}