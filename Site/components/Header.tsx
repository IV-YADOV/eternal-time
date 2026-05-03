"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal";


export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const nav = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "О сервисе" },
    { href: "/blog", label: "Журнал" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="container mx-auto">
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between gap-4 rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sm:px-6">
            
            {/* Лого */}
            <Link href="/" className="flex items-center text-xl font-black tracking-tight text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              EternalTime
            </Link>

            {/* Навигация (desktop) */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={isActive(i.href) ? "page" : undefined}
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 " +
                    (isActive(i.href)
                      ? "bg-zinc-900 text-[#FFFFFF] shadow-md"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")
                  }
                >
                  {i.label}
                </Link>
              ))}
            </nav>

            {/* Действия */}
            <div className="flex items-center gap-2 sm:gap-3">
              <AccountLink onOpenAuth={() => setIsAuthModalOpen(true)} />
              <CartLink />

              {/* Бургер (mobile) */}
              <button
                type="button"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 md:hidden"
                aria-label="Открыть меню"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="sr-only">Открыть меню</span>
                <div className="relative h-3.5 w-5">
                  <span
                    className={
                      "absolute left-0 top-0 h-[2px] w-5 rounded-full bg-zinc-900 transition-all duration-300 " +
                      (open ? "translate-y-[6px] rotate-45" : "")
                    }
                  />
                  <span
                    className={
                      "absolute left-0 top-1/2 -mt-[1px] h-[2px] w-5 rounded-full bg-zinc-900 transition-all duration-200 " +
                      (open ? "opacity-0" : "opacity-100")
                    }
                  />
                  <span
                    className={
                      "absolute left-0 bottom-0 h-[2px] w-5 rounded-full bg-zinc-900 transition-all duration-300 " +
                      (open ? "-translate-y-[6px] -rotate-45" : "")
                    }
                  />
                </div>
              </button>
            </div>
          </div>

          <MobileMenu 
            open={open} 
            nav={nav} 
            onOpenAuth={() => setIsAuthModalOpen(true)} 
          />
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}

/** Мобильное меню */
function MobileMenu({ 
  open, 
  nav, 
  onOpenAuth 
}: { 
  open: boolean; 
  nav: { href: string; label: string }[];
  onOpenAuth: () => void;
}) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return setLoggedIn(false);
        const data = await res.json();
        setLoggedIn(!!data.user);
      } catch {
        setLoggedIn(false);
      }
    })();
  }, []);

  return (
    <div
      className={
        "absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 top-full mt-2 overflow-hidden rounded-[2rem] bg-white/95 shadow-2xl ring-1 ring-zinc-200/50 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden z-50 " +
        (open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0")
      }
    >
      <nav className="flex flex-col p-4">
        {nav.map((i, idx) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-2xl px-4 py-3.5 text-base font-bold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

/** Ссылка на корзину с бейджем */
function CartLink() {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      className="relative flex h-10 items-center gap-2 rounded-full bg-zinc-100 px-3 transition-colors hover:bg-zinc-200 sm:px-4"
      aria-label={count > 0 ? `Корзина, товаров: ${count}` : "Корзина пуста"}
    >
      <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span className="hidden text-sm font-bold text-zinc-900 sm:inline">Корзина</span>
      
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FFFFFF] px-1.5 text-[11px] font-black text-zinc-900 shadow-sm ring-2 ring-white"
          aria-live="polite"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

/** Ссылка на ЛК / Вход (desktop) */
/** Ссылка на ЛК / Вход (desktop) */
function AccountLink({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const pathname = usePathname(); // Достаем текущий путь

  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  // ВАЖНО: Добавляем pathname в зависимости. 
  // Теперь при каждом переходе (в т.ч. редиректе с /auth/logout) хедер проверит сессию.
  useEffect(() => {
    checkUser();
  }, [pathname]);

  if (user) {
    return (
      <Link
        href="/account"
        className="relative flex h-10 items-center gap-2 rounded-full bg-zinc-100 px-3 transition-colors hover:bg-zinc-200 sm:px-4"
      >
        {/* КРУГЛАЯ ИКОНКА КАБИНЕТА (как вы просили) */}
          <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>

        <span className="hidden text-sm font-bold text-zinc-900 sm:inline">
          Профиль
        </span>
      </Link>
    );
  }

  return (
    <button
      onClick={onOpenAuth}
      className="relative flex h-10 items-center gap-2 rounded-full bg-zinc-100 px-3 transition-colors hover:bg-zinc-200 sm:px-4"
    >
      {/* ВАША ВЕКТОРНАЯ ИКОНКА ВОЙТИ */}
      <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span className="hidden text-sm font-bold text-zinc-900 sm:inline">Войти</span>
    </button>
  );
}

/** Хук для получения количества товаров */
function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch("/api/cart/count", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCount(Number(data.count) || 0);
      } catch {
        /* noop */
      }
    }

    fetchCount();
    const t = setInterval(fetchCount, 15000);

    const onCartChanged = () => fetchCount();
    window.addEventListener("cart:changed", onCartChanged);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cartUpdated") fetchCount();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      clearInterval(t);
      window.removeEventListener("cart:changed", onCartChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return count;
}