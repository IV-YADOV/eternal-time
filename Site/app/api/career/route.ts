import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, vacancy, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Имя и телефон обязательны" });
    }

    const html = `
      <h2>Новый отклик на вакансию</h2>
      <p><b>Вакансия:</b> ${vacancy || "Не указана"}</p>
      <p><b>Имя:</b> ${name}</p>
      <p><b>Телефон:</b> ${phone}</p>
      <p><b>Email:</b> ${email || "—"}</p>
      <p><b>Сообщение:</b></p>
      <p>${(message || "").replace(/\n/g, "<br>")}</p>
    `;

    const result = await resend.emails.send({
      from: "EternalTime Careers <onboarding@resend.dev>",
      to: process.env.HR_EMAIL!,
      subject: `Отклик: ${vacancy || "Открытая позиция"} — ${name}`,
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ success: false, error: "Ошибка отправки" });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Career API error:", e);
    return NextResponse.json({ success: false, error: "Ошибка сервера" });
  }
}