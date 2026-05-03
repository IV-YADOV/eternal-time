"use server";

import { prisma } from "@/lib/prisma";
import { createSessionForUser } from "@/lib/session";
import { claimGuestOrdersForUser } from "@/lib/orders";
import { mergeGuestCartToUser } from "@/lib/cart";

// 1. ГЕНЕРАЦИЯ И ОТПРАВКА КОДА
export async function sendOtpCode(phone: string) {
  // Очищаем старые коды
  await prisma.otpCode.deleteMany({ where: { phone } });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Используем OtpCode, который мы добавили в схему
  await prisma.otpCode.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log("\n=========================================");
  console.log(`🔑 ТЕСТОВЫЙ КОД ДЛЯ ${phone}: ${code}`);
  console.log("=========================================\n");

  return { success: true };
}

// 2. ПРОВЕРКА КОДА И АВТОРИЗАЦИЯ
export async function verifyOtpCode(phone: string, code: string) {
  try {
    // 1. Проверяем код в таблице OtpCode
    const otp = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      return { success: false, error: "Неверный или просроченный код" };
    }

    // 2. Удаляем использованный код
    await prisma.otpCode.delete({ where: { id: otp.id } });

    // 3. Ищем или создаем пользователя
    let user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      // Генерация ника для нового пользователя
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const randomName = `Collector #${randomId}`;
      
      user = await prisma.user.create({ 
        data: { 
          phone, 
          name: randomName,
          // tgId не передаем, так как он теперь опциональный
        } 
      });
    }

    // 4. Логика сессий и корзин
    await createSessionForUser(user.id);
    await mergeGuestCartToUser(user.id);
    await claimGuestOrdersForUser(user.id);

    return { success: true };
  } catch (error) {
    console.error("🔥 Auth error:", error);
    return { success: false, error: "Ошибка сервера" };
  }
}