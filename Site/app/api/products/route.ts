// app/api/products/route.ts
//
// POST /api/products
// Принимает multipart/form-data, создаёт товар в БД.
// Путь в проекте: app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function saveImages(formData: FormData, prefix: string): Promise<string[]> {
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type?.startsWith?.("image/")) continue;

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.type.split("/")[1] || "jpg").toLowerCase();
    const safePrefix = prefix.replace(/[^a-z0-9-_]/gi, "");
    const filename = `${safePrefix}-${Date.now()}-${randomUUID()}.${ext}`;

    await fs.writeFile(path.join(uploadDir, filename), buf);
    urls.push(`/uploads/${filename}`);
  }

  return urls;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name        = String(formData.get("name") || "");
    const slug        = String(formData.get("slug") || "");
    const brandId     = String(formData.get("brandId") || "");
    const categoryId  = String(formData.get("categoryId") || "");
    const price       = parseFloat(String(formData.get("price") || "0")) || 0;
    const description = String(formData.get("description") || "");
    const inStock     = parseInt(String(formData.get("inStock") || "10"), 10) || 10;
    const availability = String(formData.get("availability") || "in_stock");
    const gender      = String(formData.get("gender") || "");

    const badgeRaw = String(formData.get("badge") || "").trim().toUpperCase();
    const badge =
      ["NEW", "SALE", "HIT", "LIMITED"].includes(badgeRaw)
        ? (badgeRaw as "NEW" | "SALE" | "HIT" | "LIMITED")
        : undefined;

    // specs приходит как JSON-строка из скрипта
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

    // Проверяем уникальность slug
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Товар со slug "${slug}" уже существует (id: ${existing.id})` },
        { status: 409 }
      );
    }

    const images = await saveImages(formData, slug);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brandId,
        categoryId,
        description,
        specs,
        images,
        badge,
        variants: {
          create: [
            {
              sku: `${slug}-base`,
              priceCents: Math.round(price * 100),
              currency: "RUB",
              attributes: { color: "default" },
              inStock,
            },
          ],
        },
      },
    });

    return NextResponse.json({ id: product.id, slug: product.slug }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/products]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}