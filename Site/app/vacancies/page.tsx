"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import CareerModal from "@/components/CareerModal";

const VACANCIES = [
  {
    id: "sales-manager",
    title: "Менеджер клиентского сервиса",
    tag: "Sales",
    type: "Удаленно / Сменный график",
    description: "Первая линия нашего бутика. Обработка входящих заявок, персональный подбор культовых моделей G-Shock и полное сопровождение клиента от первого сообщения до распаковки часов.",
  },
  {
    id: "content-creator",
    title: "Контент-креатор / SMM",
    tag: "Marketing",
    type: "Удаленно / Частичная занятость",
    description: "Создание визуальной эстетики бренда. Предметная съемка часов, ведение Telegram-канала и Instagram, написание текстов со смыслом, передающих философию японской надежности.",
  },
  {
    id: "buyer",
    title: "Менеджер по закупкам (Байер)",
    tag: "Supply Chain",
    type: "Удаленно / Гибкий график",
    description: "Поиск и выкуп редких, лимитированных и базовых моделей в Азии и Европе. Организация логистики параллельного импорта и работа с зарубежными поставщиками.",
  },
  {
    id: "quality-expert",
    title: "Специалист по качеству (Мастер)",
    tag: "Service",
    type: "Офис / Мастерская",
    description: "Проверка подлинности, техническая диагностика и предпродажная подготовка механизмов. Тот самый человек, который проводит наши фирменные 12 тестов качества.",
  }
];

export default function VacanciesPage() {
  const [openVacancy, setOpenVacancy] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (vacancy?: string) => {
    setOpenVacancy(vacancy);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pt-8 pb-24 font-sans">

      <section
        className="group relative h-[50vh] sm:h-[60vh] w-full bg-zinc-950 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden flex items-center justify-center text-center px-6"
        style={{ clipPath: "inset(0 0 0 0 round 2.5rem)" }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-600 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 space-y-6 sm:space-y-8 max-w-4xl">
          <Reveal delay={0.1}>
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-8xl uppercase leading-[1.1] sm:leading-[1.05]">
              Время <br className="sm:hidden" /> создавать <br className="hidden sm:block" />
              <span className="text-zinc-500">историю</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {[
            { s: "01", t: "Стартап-драйв", d: "Минимум бюрократии, максимум влияния на итоговый продукт и прямая связь с основателями." },
            { s: "02", t: "Культура", d: "Мы фанаты своего дела. Работаем с премиальным продуктом и создаем исключительный клиентский опыт." },
            { s: "03", t: "Свобода", d: "Гибкий график и удаленная работа там, где это не вредит качеству и скорости бизнес-процессов." },
          ].map((step, idx) => (
            <Reveal key={step.s} delay={idx * 0.1}>
              <div className="h-full rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-100 p-6 sm:p-8 transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <span className="inline-block text-xs sm:text-sm font-black text-zinc-400 transition-all duration-500 group-hover:text-zinc-900 group-hover:tracking-[0.2em] uppercase">
                  {step.s}
                </span>
                <h3 className="mt-4 text-lg sm:text-xl font-black text-zinc-900 uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-1">{step.t}</h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium">{step.d}</p>
              </div>
            </Reveal>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className="space-y-10 sm:space-y-12">
          <div className="flex items-end justify-between border-b border-zinc-100 pb-6 sm:pb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Позиции</p>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl uppercase">Кого мы ищем</h2>
            </div>
            <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {VACANCIES.length} открытых вакансий
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {VACANCIES.map((job, idx) => (
              <Reveal key={job.id} delay={idx * 0.1}>
                <div className="group relative flex flex-col justify-between h-full rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-zinc-100 bg-white p-6 sm:p-10 transition-all duration-500 hover:border-zinc-900 hover:shadow-2xl hover:-translate-y-2">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                      <span className="rounded-full bg-zinc-100 px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                        {job.tag}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {job.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tighter transition-colors group-hover:text-zinc-700">
                        {job.title}
                      </h3>
                      <p className="mt-4 text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-6">
                    <button
                      onClick={() => openModal(job.title)}
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-zinc-100 px-8 text-xs font-black uppercase tracking-widest text-zinc-900 transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-105 active:scale-95"
                    >
                      Откликнуться
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="pb-4">
          <div className="group relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] bg-zinc-900 px-6 py-16 sm:py-20 text-center text-white shadow-2xl transition-all duration-700 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white opacity-5 blur-[80px] transition-all duration-1000 group-hover:scale-150 group-hover:opacity-10 group-hover:animate-pulse" />

            <h2 className="relative z-10 text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.9] transition-transform duration-500 group-hover:scale-[1.02]">
              Не нашли <br /> <span className="text-zinc-400">себя?</span>
            </h2>
            <p className="relative z-10 mt-6 text-sm sm:text-base text-zinc-400 max-w-md mx-auto font-medium px-4 leading-relaxed">
              Мы всегда открыты для талантливых людей. Напишите нам, чем вы можете быть полезны проекту, и мы обязательно рассмотрим вашу кандидатуру.
            </p>

            <div className="relative z-10 mt-10 flex justify-center">
              <button
                onClick={() => openModal()}
                className="flex h-14 sm:h-16 items-center justify-center rounded-full bg-white px-10 text-sm font-black uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 shadow-lg shadow-white/5"
              >
                Отправить резюме
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      <CareerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vacancy={openVacancy}
      />
    </div>
  );
}