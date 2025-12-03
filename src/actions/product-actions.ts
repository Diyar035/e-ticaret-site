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

    if (!categoryId) throw new Error("Lütfen bir kategori seçiniz!");

    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    // --- DOSYA KAYDETME İŞLEMİ ---
    if (files && files.length > 0) {
      // Klasör yolunu belirle
      const uploadDir = path.join(process.cwd(), "public/uploads");

      // Klasör yoksa oluştur (Önemli!)
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Türkçe karakter ve boşlukları temizle
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
        const fileName = `${Date.now()}-${safeName}`;
        const uploadPath = path.join(uploadDir, fileName);

        try {
          await writeFile(uploadPath, buffer);
          // Veritabanına '/uploads/...' olarak kaydet
          imageUrls.push(`/uploads/${fileName}`);
        } catch (err) {
          console.error("Resim kaydedilemedi:", err);
        }
      }
    }

    // Veritabanına Ekle
    await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(priceStr),
        categoryId,
        isActive: true,
        images: imageUrls, // Resim yolları burada
      },
    });
  } catch (error: unknown) {
    console.error("Hata:", error);
    let msg = "Sunucu hatası";
    if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }

  redirect("/admin/products");
}
