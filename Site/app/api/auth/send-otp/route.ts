import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("7") ? digits : "7" + digits.replace(/^8/, "");

  try {
    const formData = new URLSearchParams();
    formData.append("public_key", process.env.ZVONOK_API_KEY!);
    formData.append("phone", normalized);
    formData.append("campaign_id", process.env.ZVONOK_CAMPAIGN_ID!);

    const res = await fetch("https://zvonok.com/manager/cabapi_external/api/v1/phones/flashcall/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Zvonok response:", JSON.stringify(data));

    if (data.status !== "ok") {
      return NextResponse.json({ success: false, error: "Не удалось совершить звонок" });
    }

    const pincode = String(data.data?.pincode);
    await prisma.otpCode.deleteMany({ where: { phone } });
    await prisma.otpCode.create({
      data: { phone, code: pincode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Send OTP error:", e);
    return NextResponse.json({ success: false, error: "Ошибка сервера" });
  }
}
