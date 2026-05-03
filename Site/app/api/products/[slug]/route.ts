// app/api/products/[id]/route.ts
//
// GET    /api/products/:slug  — проверить существование товара
// PATCH  /api/products/:id   — обновить товар
// DELETE /api/products/:id   — удалить товар
//
// Путь в проекте: app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

// ─── GET /api/products/:slug ───────────────────────────────────────────────────
// Скрипт импорта вызывает этот endpoint чтобы проверить — есть ли товар с таким slug.

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slugOrId = params.id;

    // Сначала пробуем найти по slug, потом по id
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: {
        variants: { orderBy: { id: "asc" }, take: 1 },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const baseVariant = product.variants[0];

    return NextResponse.json({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: baseVariant?.priceCents ?? 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH /api/products/:id ───────────────────────────────────────────────────
// Обновляет существующий товар. Принимает те же поля что и POST /api/products.
// Если переданы новые изображения — они заменяют старые.

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: { orderBy: { id: "asc" }, take: 1 } },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const name        = String(formData.get("name") || product.name);
    const brandId     = String(formData.get("brandId") || product.brandId);
    const categoryId  = String(formData.get("categoryId") || product.categoryId);
    const price       = parseFloat(String(formData.get("price") || "0")) || 0;
    const description = String(formData.get("description") || product.description || "");
    const inStock     = parseInt(String(formData.get("inStock") || "10"), 10) || 10;
    const availability = String(formData.get("availability") || "in_stock");
    const gender      = String(formData.get("gender") || "");

    let specs: Record<string, unknown> = {};
    try {
      const json = String(formData.get("specs") || "{}");
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === "object") specs = parsed;
    } catch {
      specs = {};
    }

    if (availability === "in_stock" || availability === "preorder") {
      specs.availability = availability;
    }
    if (["men", "women", "unisex"].includes(gender)) {
      specs.gender = gender;
    }

    // Новые изображения (если переданы — заменяем старые)
    const newImageFiles = (formData.getAll("images") as File[]).filter(
      (f) => f && f.size > 0 && f.type?.startsWith("image/")
    );

    let images: string[] = product.images as string[];

    if (newImageFiles.length > 0) {
      // Удаляем старые файлы с диска
      for (const oldUrl of images) {
        const oldPath = path.join(process.cwd(), "public", oldUrl);
        try {
          await fs.unlink(oldPath);
        } catch {
          // файл уже удалён или не существует — игнорируем
        }
      }

      // Сохраняем новые
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      images = [];

      for (const file of newImageFiles) {
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = (file.type.split("/")[1] || "jpg").toLowerCase();
        const safeSlug = product.slug.replace(/[^a-z0-9-_]/gi, "");
        const filename = `${safeSlug}-${Date.now()}-${randomUUID()}.${ext}`;
        await fs.writeFile(path.join(uploadDir, filename), buf);
        images.push(`/uploads/${filename}`);
      }
    }

    // Обновляем товар
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: { 
        name, 
        brandId, 
        categoryId, 
        description, 
        specs: specs as Prisma.InputJsonValue, 
        images 
      },
    });

    // Обновляем вариант (цена и остаток)
    const baseVariant = product.variants[0];
    if (baseVariant) {
      await prisma.productVariant.update({
        where: { id: baseVariant.id },
        data: {
          priceCents: Math.round(price * 100),
          inStock,
        },
      });
    }

    return NextResponse.json({ id: updated.id, slug: updated.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[PATCH /api/products/:id]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/products/:id ──────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Удаляем файлы изображений с диска
    for (const imgUrl of product.images as string[]) {
      const imgPath = path.join(process.cwd(), "public", imgUrl);
      try {
        await fs.unlink(imgPath);
      } catch {
        // игнорируем если файл не найден
      }
    }

    // Удаляем товар (variants удалятся каскадно если настроен onDelete: Cascade в schema)
    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[DELETE /api/products/:id]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}