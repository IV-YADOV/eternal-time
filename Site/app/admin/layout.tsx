// app/admin/layout.tsx
import Link from "next/link";
import AdminNav from "./AdminNav";

export const metadata = {
  title: "EternalTick Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      
      {/* ПЛАВАЮЩИЙ ХЕДЕР АДМИНКИ (в стиле основного сайта) */}
      <header className="sticky top-4 z-50 w-full lg:top-6">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative">
          
          {/* Стеклянная панель управления */}
          <div className="flex items-center justify-between gap-4 rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sm:px-6">
            
            <div className="flex items-center gap-8">
              {/* Лого админки */}
              <Link href="/admin" className="flex items-center text-lg font-bold tracking-tight text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Admin<span className="text-amber-500">Tick</span>.
              </Link>

              {/* Навигация (Client Component с твоими ссылками) */}
              <div className="hidden md:block">
                <AdminNav />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Быстрая кнопка на сайт */}
              <Link 
                href="/" 
                className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-all hover:bg-zinc-200 hover:text-zinc-900 sm:flex"
              >
                <span>На сайт</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>

              <div className="h-6 w-px bg-zinc-200" />

              {/* Выход */}
              <form action="/admin/logout" method="post">
                <button className="rounded-full px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600">
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Контент теперь идет ровно вровень с хедером */}
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-200/50 sm:p-10 lg:p-12">
          {children}
        </div>
      </main>

      {/* ФУТЕР АДМИНКИ */}
      <footer className="mx-auto max-w-[1400px] px-4 pb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          EternalTick Control Center · {new Date().getFullYear()} · build 0.4.5
        </p>
      </footer>
    </div>
  );
}