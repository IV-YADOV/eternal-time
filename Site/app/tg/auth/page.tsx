"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TgAuthInner() {
  const sp = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const code = sp.get("code");
    if (!code) return;
    (async () => {
      const r = await fetch("/api/auth/tg/consume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      router.replace(r.ok ? "/account" : "/auth/tg/code?e=1");
    })();
  }, [sp, router]);
  return <div className="p-8">Авторизация через Telegram…</div>;
}

export default function TgAuthPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка…</div>}>
      <TgAuthInner />
    </Suspense>
  );
}
