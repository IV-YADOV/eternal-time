import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes, createHmac } from "crypto";

const COOKIE = "sid";
const SEC = process.env.SESSION_SECRET!;

function sign(v: string) {
  const sig = createHmac("sha256", SEC).update(v).digest("base64url");
  return `${v}.${sig}`;
}

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  const otp = await prisma.otpCode.findFirst({
    where: { phone, code, expiresAt: { gt: new Date() } },
  });

  if (!otp) {
    return NextResponse.json({ success: false, error: "Неверный код" });
  }

  await prisma.otpCode.delete({ where: { id: otp.id } });

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    user = await prisma.user.create({
      data: { phone, name: `Collector #${randomId}` },
    });
  }

  const raw = randomBytes(24).toString("base64url");
  await prisma.session.create({ data: { userId: user.id, token: raw } });

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE, sign(raw), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
