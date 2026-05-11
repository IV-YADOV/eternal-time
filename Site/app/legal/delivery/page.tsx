export const metadata = {
  title: "Доставка и оплата — EternalTime",
  description: "Способы доставки часов по России, сроки и стоимость. Доступные методы оплаты заказа.",
};

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 space-y-10">

      {/* Шапка */}
      <header className="space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Покупателям
        </p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
          Доставка и оплата
        </h1>
        <p className="text-sm text-zinc-500">
          Дата обновления: 11 мая 2026 г.
        </p>
      </header>

      {/* Быстрая навигация */}
      <nav className="grid gap-3 sm:grid-cols-2">
        <a href="#delivery" className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200/60 transition-all hover:bg-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">01</p>
          <p className="mt-1 text-sm font-bold text-zinc-900">Доставка по России</p>
        </a>
        <a href="#payment" className="rounded-2xl bg-zinc-900 p-5 text-white transition-all hover:bg-zinc-800">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">02</p>
          <p className="mt-1 text-sm font-bold">Способы оплаты</p>
        </a>
      </nav>

      {/* 1. ДОСТАВКА */}
      <section id="delivery" className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Доставка</h2>
        <p className="text-zinc-700 leading-relaxed">
          Мы отправляем заказы по всей России с тщательной упаковкой каждого экземпляра. Часы помещаются в фирменную коробку, обёрнутую в защитный материал, и снабжены гарантийным талоном.
        </p>

        {/* Способы доставки */}
        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Способы доставки</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-3 transition-all hover:ring-zinc-900 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-900">СДЭК</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Курьер / ПВЗ</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Доставка курьером до двери или самовывоз из пункта выдачи. Возможна примерка перед оплатой.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-700 pt-2 border-t border-zinc-100">
              <span>1–7 рабочих дней</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-3 transition-all hover:ring-zinc-900 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-900">Почта России</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Отделение</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Отправка 1-м классом до отделения связи. Подходит для отдалённых регионов.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-700 pt-2 border-t border-zinc-100">
              <span>5–14 рабочих дней</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-3 transition-all hover:ring-zinc-900 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-900">Boxberry</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ПВЗ</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Получение в пунктах выдачи Boxberry в большинстве городов России.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-700 pt-2 border-t border-zinc-100">
              <span>2–7 рабочих дней</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-3 transition-all hover:ring-zinc-900 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-900">Курьер по Хабаровску</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Город</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Бесплатная доставка курьером по Хабаровску в день заказа или на следующий день.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-700 pt-2 border-t border-zinc-100">
              <span>В день заказа</span>
            </div>
          </div>
        </div>

        {/* Стоимость и сроки */}
        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">Стоимость и сроки</h3>
        <div className="rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/60 p-6 space-y-3 text-sm text-zinc-700 leading-relaxed">
          <p>
            <strong className="text-zinc-900">Стоимость доставки</strong> рассчитывается автоматически при оформлении заказа исходя из веса, габаритов и региона получателя по тарифам выбранной службы доставки.
          </p>
          <p>
            <strong className="text-zinc-900">Сроки доставки</strong> являются ориентировочными и зависят от региона, работы транспортных компаний и почтовых служб. Точный срок указывается при оформлении заказа.
          </p>
          <p>
            <strong className="text-zinc-900">Отправка заказа</strong> производится в течение 1–2 рабочих дней после оплаты или подтверждения заказа менеджером.
          </p>
        </div>

        {/* Получение */}
        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 pt-4">При получении</h3>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-900 leading-relaxed space-y-2">
          <p className="font-bold">⚠️ Обязательно проверьте посылку при получении</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>целостность упаковки;</li>
            <li>комплектацию заказа;</li>
            <li>соответствие модели и артикула;</li>
            <li>отсутствие видимых повреждений товара.</li>
          </ul>
          <p className="pt-2">
            При обнаружении проблем — сразу свяжитесь с нами, не подписывая документы о получении без замечаний.
          </p>
        </div>
      </section>

      {/* 2. ОПЛАТА */}
      <section id="payment" className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Оплата</h2>
        <p className="text-zinc-700 leading-relaxed">
          Цены на сайте указаны в рублях Российской Федерации и включают все применимые налоги. Оплатить заказ можно одним из удобных способов:
        </p>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-2 transition-all hover:ring-zinc-900">
            <div className="flex items-center justify-between">
              <p className="text-base font-black uppercase tracking-tight text-zinc-900">Система быстрых платежей</p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">Рекомендуем</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Оплата через приложение вашего банка по QR-коду или ссылке. Без комиссии, мгновенное зачисление.
            </p>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-2 transition-all hover:ring-zinc-900">
            <p className="text-base font-black uppercase tracking-tight text-zinc-900">Банковская карта</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Visa, Mastercard, МИР. Безопасная оплата через защищённый платёжный шлюз.
            </p>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-2 transition-all hover:ring-zinc-900">
            <p className="text-base font-black uppercase tracking-tight text-zinc-900">Перевод на счёт ИП</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              По реквизитам для физических и юридических лиц. Реквизиты предоставит менеджер при оформлении заказа.
            </p>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-zinc-200 p-6 space-y-2 transition-all hover:ring-zinc-900">
            <p className="text-base font-black uppercase tracking-tight text-zinc-900">Оплата при получении</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Доступна в пунктах выдачи СДЭК и Boxberry с предварительным согласованием с менеджером. Возможна примерка перед оплатой.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/60 p-6 space-y-3 text-sm text-zinc-700 leading-relaxed">
          <p>
            <strong className="text-zinc-900">Безопасность платежей.</strong> Все онлайн-платежи проходят через защищённое соединение с использованием современных стандартов шифрования.
          </p>
          <p>
            <strong className="text-zinc-900">Чеки и документы.</strong> После оплаты вы получите электронный чек в соответствии с требованиями 54-ФЗ.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[2rem] bg-zinc-900 text-white p-8 sm:p-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 max-w-md">
            <h3 className="text-2xl font-black uppercase tracking-tight">Есть вопросы?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Поможем подобрать удобный способ доставки и оплаты — напишите нам или позвоните.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 sm:flex-row">
            <a
              href="tel:+79141720242"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-xs font-black uppercase tracking-[0.25em] text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-[1.02]"
            >
              Позвонить
            </a>
            <a
              href="mailto:support@eternal-time.online"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10"
            >
              Написать
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}