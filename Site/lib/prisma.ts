import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error"],
  });

// Всегда сохраняем в global чтобы не создавать новые соединения
global.prisma = prisma;
