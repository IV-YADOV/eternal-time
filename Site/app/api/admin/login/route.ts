import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/admin");

  // Получаем реальный домен (Pinggy) и протокол (https) из заголовков
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const base = new URL(`${protocol}://${host}`);

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.redirect(new URL(next, base), { status: 303 });
    
    res.cookies.set("admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
      secure: false,
    });
    return res;
  }

  const url = new URL("/admin/login", base);
  url.searchParams.set("error", "1");
  return NextResponse.redirect(url, { status: 303 });
}