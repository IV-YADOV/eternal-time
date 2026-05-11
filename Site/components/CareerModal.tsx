"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CareerModal({
  isOpen,
  onClose,
  vacancy,
}: {
  isOpen: boolean;
  onClose: () => void;
  vacancy?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Заполните имя и телефон");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, vacancy }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setName(""); setPhone(""); setEmail(""); setMessage("");
      } else {
        setError(data.error || "Не удалось отправить");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }} className="flex items-center justify-center px-4">
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)' }} onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 sm:p-10 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900 transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Отклик отправлен</h3>
            <p className="mt-3 text-sm text-zinc-500">Мы свяжемся с вами в ближайшее время</p>
            <button onClick={onClose} className="mt-8 h-12 rounded-full bg-zinc-900 px-8 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800">
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Отклик</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-zinc-900">
              {vacancy || "Открытая позиция"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 w-full rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-900/20 placeholder:text-zinc-400"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 w-full rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-900/20 placeholder:text-zinc-400"
              />
              <input
                type="email"
                placeholder="Email (необязательно)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-900/20 placeholder:text-zinc-400"
              />
              <textarea
                placeholder="Расскажите о себе (опыт, ссылки на работы)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-2xl bg-zinc-100 p-5 text-sm font-medium text-zinc-900 outline-none transition-all focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-900/20 placeholder:text-zinc-400 resize-none"
              />

              {error && <p className="text-center text-xs font-bold uppercase text-red-500 tracking-widest">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-full bg-zinc-900 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Отправить отклик"}
              </button>

              <p className="text-center text-[10px] text-zinc-400 leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}