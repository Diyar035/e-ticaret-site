"use server";

import { prisma } from "@/lib/prisma-client";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!priceStr || isNaN(parseFloat(priceStr))) {
      throw new Error("Geçerli bir fiyat giriniz.");
    }
    if (!categoryId) {
      throw new Error("Kategori seçimi zorunludur!");
    }

    const price = parseFloat(priceStr);

    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
        const fileName = `${Date.now()}-${safeName}`;
        const uploadPath = path.join(uploadDir, fileName);

        try {
          await writeFile(uploadPath, buffer);
          imageUrls.push(`/uploads/${fileName}`);
        } catch (fileError) {
          console.error("Dosya yazma hatası:", fileError);
        }
      }
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        isActive: true,
        images: imageUrls,
      },
    });
  } catch (error: unknown) {
    console.error("Ürün ekleme hatası detaylı:", error);
    let errorMessage = "Sunucu tarafında bir hata oluştu.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }

  // Redirect, try-catch bloğunun DIŞINDA olmalı (Next.js kuralı)
  redirect("/admin/products");
}
