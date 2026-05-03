import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });
}

export default async function AdminHome() {
  // Расчет временных рамок
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Параллельные запросы к БД для скорости
  const [ordersToday, monthlyRevenue, activeProductsCount] = await Promise.all([
    // 1. Заказы за сегодня
    prisma.order.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    }),
    // 2. Выручка за текущий месяц (считаем только успешные/в работе заказы)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { notIn: ["Отменен", "Возврат"] },
      },
      _sum: {
        totalCents: true,
      },
    }),
    // 3. Количество активных товаров (не в архиве)
    prisma.product.count({
      where: {
        isArchived: false,
      },
    }),
  ]);

  const revenue = monthlyRevenue._sum.totalCents || 0;

  const adminSections = [
    {
      title: "Товары",
      description: "Управление каталогом: добавление моделей, цен и складских остатков.",
      href: "/admin/products",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Заказы",
      description: "Обработка новых поступлений, логистика и работа со статусами.",
      href: "/admin/orders",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Маркетинг",
      description: "Промокоды, аналитика скидок и партнерские программы.",
      href: "/admin/promos",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Журнал",
      description: "Написание качественных статей и обзоров в блог EternalTick.",
      href: "/admin/posts",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-20">
      {/* Приветствие */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Control Panel</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">
            Добро пожаловать, <span className="text-amber-500">Иван</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Система активна</span>
        </div>
      </div>

      {/* РЕАЛЬНАЯ СТАТИСТИКА */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Заказов сегодня</p>
          <p className="mt-4 text-4xl font-black text-zinc-900">{ordersToday}</p>
          <div className="mt-4 h-1 w-12 rounded-full bg-zinc-100" />
        </div>

        <div className="rounded-[2rem] bg-zinc-900 p-8 shadow-xl shadow-zinc-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Выручка ({now.toLocaleString('ru-RU', { month: 'long' })})</p>
          <p className="mt-4 text-4xl font-black text-white">{formatMoney(revenue)}</p>
          <p className="mt-2 text-[10px] font-bold uppercase text-emerald-400">Без учета возвратов</p>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Активных товаров</p>
          <p className="mt-4 text-4xl font-black text-zinc-900">{activeProductsCount}</p>
          <div className="mt-4 h-1 w-12 rounded-full bg-zinc-100" />
        </div>
      </div>

      {/* Разделы */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group flex flex-col justify-between rounded-[2.5rem] border border-zinc-100 bg-white p-8 transition-all hover:-translate-y-1 hover:border-zinc-200 hover:shadow-2xl hover:shadow-zinc-200/50"
          >
            <div>
              <div className={`mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${section.color} transition-transform group-hover:scale-110`}>
                {section.icon}
              </div>
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{section.title}</h2>
              <p className="mt-3 text-xs font-medium leading-relaxed text-zinc-500">
                {section.description}
              </p>
            </div>
            
            <div className="mt-10 flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-900 group-hover:text-amber-600">
              Открыть
              <svg className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Поддержка и Доки */}
      <div className="relative overflow-hidden rounded-[3rem] bg-zinc-950 p-10 text-white sm:p-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500 opacity-10 blur-[80px]" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h3 className="text-3xl font-black uppercase tracking-tight">Техническая база</h3>
          <p className="text-sm font-medium leading-relaxed text-zinc-400">
            Если возникли сложности с управлением базой данных, настройкой Telegram-уведомлений или нужно добавить новый функционал — вся информация собрана в справочнике.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/admin/docs" className="rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-200 active:scale-95">
              Документация
            </Link>
            <a href="https://t.me/yadow" target="_blank" className="rounded-full border border-zinc-800 bg-zinc-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-700 hover:text-white">
              Срочная помощь
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}