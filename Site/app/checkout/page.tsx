"use client";
import { useState } from "react";

type ContactMethod = "telegram" | "phone" | "email";

export default function CheckoutPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");

  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("telegram");
  const [contactValue, setContactValue] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  // ошибки
  const [errors, setErrors] = useState<{ name?: string; contact?: string; address?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Пожалуйста, введите ваше имя";
    if (!contactValue.trim()) newErrors.contact = "Укажите контакт для связи";
    if (!address.trim()) newErrors.address = "Введите адрес доставки";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;

    setStatus("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          contactMethod,
          contactValue: contactValue.trim(),
          address,
          comment,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      window.location.href = `/checkout/success?order=${data.orderId}`;
    } catch {
      setStatus("error");
    }
  };

  // Общие стили для полей ввода
  const inputBaseStyle = "w-full rounded-2xl border bg-zinc-50 px-5 py-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-1";
  const inputNormalStyle = "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400 hover:border-zinc-300";
  const inputErrorStyle = "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16 space-y-10">
      
      {/* Заголовок */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Оформление заказа</h1>
        <p className="text-base text-zinc-500">Заполните данные для доставки, и мы свяжемся с вами в ближайшее время</p>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="space-y-8">
          
          {/* Имя */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-zinc-900">Как к вам обращаться?</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`${inputBaseStyle} ${errors.name ? inputErrorStyle : inputNormalStyle}`}
              placeholder="Иван Иванов"
            />
            {errors.name && <p className="text-xs font-medium text-red-500 pl-1">{errors.name}</p>}
          </div>

          {/* Контакты */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-zinc-900">Удобный способ связи</label>
            
            {/* iOS-style Segmented Control */}
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-zinc-100 p-1.5">
              {(["telegram", "phone", "email"] as ContactMethod[]).map((method) => (
                <label
                  key={method}
                  className={`cursor-pointer rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                    contactMethod === method
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    className="hidden"
                    checked={contactMethod === method}
                    onChange={() => {
                      setContactMethod(method);
                      setContactValue(""); // очищаем поле при смене типа
                      if (errors.contact) setErrors({ ...errors, contact: undefined });
                    }}
                  />
                  {method === "telegram" ? "Telegram" : method === "phone" ? "Телефон" : "Email"}
                </label>
              ))}
            </div>

            <input
              value={contactValue}
              onChange={(e) => {
                setContactValue(e.target.value);
                if (errors.contact) setErrors({ ...errors, contact: undefined });
              }}
              className={`${inputBaseStyle} mt-3 ${errors.contact ? inputErrorStyle : inputNormalStyle}`}
              placeholder={
                contactMethod === "telegram"
                  ? "@username"
                  : contactMethod === "phone"
                  ? "+7 (999) 000-00-00"
                  : "you@example.com"
              }
            />
            {errors.contact && <p className="text-xs font-medium text-red-500 pl-1">{errors.contact}</p>}
          </div>

          {/* Адрес */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-zinc-900">Адрес доставки</label>
            <textarea
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              placeholder="Город, улица, дом, квартира..."
              className={`min-h-[120px] resize-none ${inputBaseStyle} ${errors.address ? inputErrorStyle : inputNormalStyle}`}
            />
            {errors.address && <p className="text-xs font-medium text-red-500 pl-1">{errors.address}</p>}
          </div>

          {/* Комментарий */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-zinc-900">
              Комментарий к заказу <span className="font-medium text-zinc-400">(необязательно)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Например: позвонить за час, оставить у двери..."
              className={`min-h-[100px] resize-none ${inputBaseStyle} ${inputNormalStyle}`}
            />
          </div>
        </div>
      </div>

      {/* Нижний блок: Инфо и Кнопка */}
      <div className="space-y-6 max-w-2xl mx-auto">
        
        {/* Инфо-блок */}
        <div className="flex gap-4 rounded-3xl bg-amber-50 p-6 ring-1 ring-zinc-400/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Оплата при получении</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
              Онлайн-оплата временно отключена. Заказ будет создан со статусом <b>Собирается</b>. Менеджер свяжется с вами для подтверждения деталей.
            </p>
          </div>
        </div>

        {/* Кнопка оформления */}
        <button
          onClick={placeOrder}
          className="flex h-14 w-full items-center justify-center rounded-full bg-zinc-400 px-8 text-base font-bold text-white shadow-md shadow-zinc-400/20 transition-all hover:scale-[1.02] hover:bg-amber-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          disabled={status === "processing"}
        >
          {status === "processing" ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Оформляем заказ...
            </span>
          ) : (
            "Подтвердить заказ"
          )}
        </button>

        {/* Ошибка */}
        {status === "error" && (
          <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-semibold text-red-600 ring-1 ring-red-500/20">
            Произошла ошибка при создании заказа. Пожалуйста, попробуйте ещё раз.
          </div>
        )}
      </div>
    </div>
  );
}