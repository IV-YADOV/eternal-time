"use client";

import { useState, useEffect, useRef } from "react";


export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Реф для фокуса на скрытом инпуте кода
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // --- ЛОГИКА ФОРМАТИРОВАНИЯ ТЕЛЕФОНА ---
  // --- ОБНОВЛЕННАЯ ЛОГИКА ФОРМАТИРОВАНИЯ ---
  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "";
    
    // Всегда начинаем с +7 (
    let res = "+7 (";
    
    // Берем только значащие цифры (после семерки)
    // Если пользователь ввел 7 или 8 в начале, отсекаем это
    const main = (digits.startsWith('7') || digits.startsWith('8')) ? digits.slice(1) : digits;

    res += main.substring(0, 3);
    if (main.length >= 3) res += ") ";
    res += main.substring(3, 6);
    if (main.length >= 6) res += "-";
    res += main.substring(6, 8);
    if (main.length >= 8) res += "-";
    res += main.substring(8, 10);
    
    return res;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let digits = input.replace(/\D/g, "");

    // ПРОВЕРКА НА УДАЛЕНИЕ (Backspace)
    // Если длина нового значения меньше текущего, значит пользователь что-то стирает
    if (input.length < phone.length) {
      const charToDelete = phone[input.length]; // Символ, который стоял на месте удаления
      
      // Если пользователь удалил разделитель (пробел, скобку или тире),
      // нам нужно вручную удалить цифру, которая стоит перед ним
      if (/\D/.test(charToDelete)) {
        digits = digits.slice(0, -1);
      }
    }

    const formatted = formatPhoneNumber(digits);
    if (formatted.length <= 18) setPhone(formatted);
  };

  // --- ЛОГИКА ВВОДА КОДА ---
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCode(val);
    if (val.length === 4) setError("");
  };

  // Автофокус на код при переходе на шаг 2
  useEffect(() => {
    if (step === 2) setTimeout(() => hiddenInputRef.current?.focus(), 100);
  }, [step]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = phone.replace(/\D/g, "");
    if (rawPhone.length < 11) { setError("Введите полный номер"); return; }
    
    setError(""); setIsLoading(true);
    const res = await fetch("/api/auth/send-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone }) }).then(r => r.json());
    setIsLoading(false);
    if (res.success) setStep(2);
    else setError("Ошибка сети");
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length < 4) return;
    
    setError(""); setIsLoading(true);
    const res = await fetch("/api/auth/phone", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone, code }) }).then(r => r.json());
    setIsLoading(false);
    if (res.success) {
      window.location.href = "/account"; 
    } else {
      setError(res.error || "Неверный код");
      setCode(""); // Сбрасываем код при ошибке
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[3rem] bg-zinc-900 p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Platinum Glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5E4E2] opacity-[0.07] blur-[100px] pointer-events-none" />

        <button onClick={onClose} className="absolute right-8 top-8 text-zinc-500 hover:text-white transition-all hover:rotate-90">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E5E4E2]/60">Identity Terminal</p>
          <h2 className="mt-3 text-3xl font-black text-white uppercase tracking-tighter">
            {step === 1 ? "Авторизация" : "Подтверждение"}
          </h2>
        </div>

        <div className="mt-10">
          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="h-16 w-full rounded-2xl bg-white/5 border border-white/10 px-6 text-center text-xl font-bold text-[#E5E4E2] outline-none transition-all focus:border-[#E5E4E2]/40 focus:bg-white/[0.07] placeholder:text-zinc-700"
                />
              </div>
              {error && <p className="text-center text-[10px] font-bold uppercase text-red-400 tracking-widest">{error}</p>}
              <button
                disabled={isLoading}
                className="h-16 w-full rounded-2xl bg-[#E5E4E2] text-[11px] font-black uppercase tracking-[0.25em] text-zinc-900 transition-all hover:bg-white active:scale-[0.97] disabled:opacity-50 shadow-xl shadow-white/5"
              >
                {isLoading ? "Обработка..." : "Получить код"}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="relative flex justify-center gap-2 sm:gap-3">
                {/* Скрытый инпут для управления вводом */}
                <input
                  ref={hiddenInputRef}
                  type="text"
                  maxLength={4}
                  value={code}
                  onChange={handleCodeChange}
                  className="absolute inset-0 opacity-0 cursor-default"
                  autoFocus
                />
                
                {/* Визуальные ячейки */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-14 w-10 sm:h-16 sm:w-12 rounded-xl border flex items-center justify-center text-2xl font-black transition-all duration-300
                      ${code[i] ? "border-[#E5E4E2] text-[#E5E4E2] bg-white/5" : "border-white/10 text-zinc-700"}
                      ${code.length === i ? "ring-2 ring-[#E5E4E2]/30 border-[#E5E4E2]/50 scale-105" : ""}
                    `}
                  >
                    {code[i] || "•"}
                  </div>
                ))}
              </div>

              {error && <p className="text-center text-[10px] font-bold uppercase text-red-400 tracking-widest">{error}</p>}

              <div className="space-y-4">
                <button
                  onClick={() => handleVerifyCode()}
                  disabled={isLoading || code.length < 4}
                  className="h-16 w-full rounded-2xl bg-[#E5E4E2] text-[11px] font-black uppercase tracking-[0.25em] text-zinc-900 transition-all hover:bg-white active:scale-[0.97] disabled:opacity-50 shadow-xl shadow-white/5"
                >
                  {isLoading ? "Синхронизация..." : "Войти в аккаунт"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                >
                  ← Назад к номеру
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-[10px] font-medium leading-relaxed text-zinc-600 uppercase tracking-tighter opacity-50">
          Security Protocol v2.4 <br /> Private Access Only
        </p>
      </div>
    </div>
  );
}