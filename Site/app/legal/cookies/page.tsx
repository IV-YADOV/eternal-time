export const metadata = {
  title: "Политика использования cookies — EternalTime",
  description: "Согласие и политика использования файлов cookie на сайте eternal-time.online.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-10">

      {/* Шапка */}
      <header className="space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Правовая информация
        </p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
          Согласие и политика использования cookie
        </h1>
        <p className="text-sm text-zinc-500">
          Дата обновления: 11 мая 2026 г.
        </p>
      </header>

      {/* 1. ОБЩИЕ ПОЛОЖЕНИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">1. Общие положения</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>
            1.1. Настоящее согласие и политика использования файлов cookie (далее — «Политика cookie») применяется к сайту{" "}
            <a href="https://eternal-time.online/" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">
              https://eternal-time.online/
            </a>{" "}
            (далее — «Сайт»).
          </p>
          <p>1.2. Оператором персональных данных и владельцем Сайта является индивидуальный предприниматель Соловьев Сергей Сергеевич, ОГРНИП 325270000040020, ИНН 790153027990 (далее — «Оператор»).</p>
          <p>1.3. Используя Сайт и нажимая кнопку «Принять», «Согласен» или аналогичную кнопку в cookie-баннере, Пользователь подтверждает согласие на обработку данных, собираемых с использованием cookie-файлов, на условиях настоящей Политики cookie.</p>
          <p>1.4. Если Пользователь не согласен с использованием cookie-файлов, он может изменить настройки браузера, заблокировать или удалить cookie. В этом случае часть функций Сайта может работать некорректно, включая авторизацию, корзину, сохранение выбранных товаров и оформление заказа.</p>
        </div>
      </section>

      {/* 2. ЧТО ТАКОЕ COOKIE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">2. Что такое cookie</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>2.1. Cookie — это небольшие текстовые файлы, которые сохраняются в браузере или на устройстве Пользователя при посещении Сайта. Cookie позволяют Сайту узнавать устройство Пользователя, поддерживать работу корзины, авторизации, настроек интерфейса, а также получать техническую и статистическую информацию о работе Сайта.</p>
          <p>2.2. Cookie могут содержать технические идентификаторы, сведения о действиях на Сайте, информацию о браузере, устройстве, дате и времени посещения, IP-адресе, источнике перехода и иных технических параметрах.</p>
        </div>
      </section>

      {/* 3. КАКИЕ COOKIE ИСПОЛЬЗУЕТ САЙТ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">3. Какие cookie использует сайт</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>3.1. Сайт может использовать следующие категории cookie:</p>
        </div>
        <dl className="space-y-3 text-zinc-700 leading-relaxed pl-4 border-l-2 border-zinc-200">
          <div>
            <dt className="font-bold text-zinc-900 inline">Обязательные технические cookie</dt>
            <dd className="inline"> — необходимы для корректной работы Сайта, корзины, оформления заказа, авторизации, безопасности и сохранения пользовательской сессии.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Функциональные cookie</dt>
            <dd className="inline"> — позволяют запоминать пользовательские настройки, например выбранные параметры интерфейса или ранее добавленные товары.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Аналитические cookie</dt>
            <dd className="inline"> — используются для понимания того, как Пользователи взаимодействуют с Сайтом, какие страницы посещают, какие ошибки возникают, какие разделы требуют улучшения.</dd>
          </div>
          <div>
            <dt className="font-bold text-zinc-900 inline">Маркетинговые cookie</dt>
            <dd className="inline"> — используются только при подключении рекламных и ретаргетинговых сервисов и только при наличии необходимого согласия Пользователя.</dd>
          </div>
        </dl>
        <p className="text-zinc-700 leading-relaxed">
          3.2. На момент подготовки настоящего документа на Сайте заявлены технические cookie, cookie корзины, cookie авторизации и технические данные, связанные с аналитикой. Если в дальнейшем будут подключены Яндекс.Метрика, VK Реклама, Google Analytics, пиксели рекламных систем или иные внешние сервисы, Оператор обновит настоящую Политику cookie и укажет такие сервисы в явном виде.
        </p>
      </section>

      {/* 4. ЦЕЛИ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">4. Цели использования cookie</h2>
        <p className="text-zinc-700 leading-relaxed">4.1. Оператор использует cookie и аналогичные технологии для следующих целей:</p>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>обеспечение работоспособности Сайта и его отдельных функций;</li>
          <li>сохранение товаров в корзине и параметров пользовательской сессии;</li>
          <li>оформление и сопровождение заказов;</li>
          <li>обеспечение безопасности Сайта и предотвращение злоупотреблений;</li>
          <li>анализ посещаемости, улучшение структуры, скорости и удобства Сайта;</li>
          <li>персонализация интерфейса и пользовательского опыта;</li>
          <li>показ релевантной рекламы и оценка её эффективности — только при подключении соответствующих сервисов и наличии необходимого согласия.</li>
        </ul>
      </section>

      {/* 5. ПРАВОВОЕ ОСНОВАНИЕ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">5. Правовое основание обработки</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>5.1. Обработка данных, собираемых с использованием cookie-файлов, осуществляется на основании согласия Пользователя, выраженного путём нажатия кнопки согласия в cookie-баннере, а также на основании необходимости обеспечения работы Сайта и исполнения договора с Пользователем в части обязательных технических cookie.</p>
          <p>5.2. Согласие Пользователя должно быть свободным, конкретным, информированным, сознательным и однозначным. Оператор обеспечивает Пользователю возможность ознакомиться с настоящей Политикой cookie до предоставления согласия.</p>
        </div>
      </section>

      {/* 6. ПЕРЕДАЧА ТРЕТЬИМ ЛИЦАМ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">6. Передача данных третьим лицам</h2>
        <p className="text-zinc-700 leading-relaxed">6.1. Оператор может поручать обработку данных или предоставлять доступ к данным, собираемым с использованием cookie, третьим лицам только в объёме, необходимом для достижения целей обработки. К таким лицам могут относиться:</p>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>хостинг-провайдеры и поставщики инфраструктуры Сайта;</li>
          <li>сервисы аналитики посещаемости;</li>
          <li>платёжные и антифрод-сервисы;</li>
          <li>сервисы рассылок и уведомлений;</li>
          <li>рекламные и маркетинговые платформы — при их подключении и наличии необходимого согласия Пользователя;</li>
          <li>иные подрядчики, обеспечивающие работу Сайта и интернет-магазина.</li>
        </ul>
        <p className="text-zinc-700 leading-relaxed">6.2. Оператор не продаёт персональные данные Пользователей третьим лицам.</p>
      </section>

      {/* 7. СРОК ХРАНЕНИЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">7. Срок хранения cookie</h2>
        <p className="text-zinc-700 leading-relaxed">7.1. Срок хранения cookie зависит от их типа и назначения:</p>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>сессионные cookie хранятся до закрытия браузера или завершения пользовательской сессии;</li>
          <li>постоянные cookie могут храниться до истечения установленного срока хранения или до их удаления Пользователем;</li>
          <li>аналитические и маркетинговые cookie хранятся в сроки, определяемые настройками соответствующих сервисов и настоящей Политикой cookie.</li>
        </ul>
        <p className="text-zinc-700 leading-relaxed">7.2. Пользователь может удалить cookie в настройках браузера в любое время.</p>
      </section>

      {/* 8. УПРАВЛЕНИЕ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">8. Управление cookie</h2>
        <p className="text-zinc-700 leading-relaxed">8.1. Пользователь может управлять cookie следующими способами:</p>
        <ul className="list-disc pl-8 space-y-2 text-zinc-700 leading-relaxed">
          <li>принять cookie через баннер на Сайте;</li>
          <li>отказаться от необязательных cookie, если такая функция реализована на Сайте;</li>
          <li>удалить ранее сохранённые cookie в настройках браузера;</li>
          <li>запретить сохранение cookie полностью или частично через настройки браузера.</li>
        </ul>
        <p className="text-zinc-700 leading-relaxed">8.2. Отключение обязательных технических cookie может привести к невозможности пользоваться отдельными функциями Сайта, включая корзину, авторизацию и оформление заказа.</p>
      </section>

      {/* 9. ПРАВА ПОЛЬЗОВАТЕЛЯ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">9. Права пользователя</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>
            9.1. Пользователь вправе запросить у Оператора информацию об обработке своих персональных данных, потребовать уточнения, блокирования или уничтожения данных, а также отозвать согласие на обработку персональных данных в порядке, предусмотренном законодательством Российской Федерации и{" "}
            <a href="/legal/privacy" className="font-semibold text-zinc-900 underline underline-offset-2 hover:no-underline">
              Политикой обработки персональных данных
            </a>{" "}
            Оператора.
          </p>
          <p>9.2. Для обращения к Оператору Пользователь может использовать контактные данные, указанные на Сайте.</p>
        </div>
      </section>

      {/* 10. ИЗМЕНЕНИЕ ПОЛИТИКИ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">10. Изменение политики cookie</h2>
        <div className="space-y-3 text-zinc-700 leading-relaxed">
          <p>10.1. Оператор вправе изменять настоящую Политику cookie. Новая редакция применяется с момента размещения на Сайте, если иное не указано в новой редакции.</p>
          <p>10.2. Пользователю рекомендуется периодически проверять актуальную редакцию Политики cookie на Сайте.</p>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="space-y-4 rounded-[2rem] bg-zinc-50 p-8 ring-1 ring-zinc-200/60">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">11. Контакты Оператора</h2>
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
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Сайт</dt>
            <dd>
              <a href="https://eternal-time.online" className="text-zinc-900 hover:underline">eternal-time.online</a>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-xs font-black uppercase tracking-widest text-zinc-400 sm:w-44 shrink-0 pt-0.5">Email</dt>
            <dd>
              <a href="mailto:support@eternal-time.online" className="text-zinc-900 hover:underline">support@eternal-time.online</a>
            </dd>
          </div>
        </dl>
      </section>

    </div>
  );
}