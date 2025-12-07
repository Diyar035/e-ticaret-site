"use server";

import { prisma } from "@/lib/prisma-client";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// --- 1. FONKSİYON: YENİ ÜRÜN EKLEME (VE AKILLI STOK GÜNCELLEME) ---
export async function createProductAction(formData: FormData) {
  try {
    const rawName = formData.get("name");
    const rawDesc = formData.get("description");
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const categoryId = formData.get("categoryId") as string;

    // Validasyonlar
    if (!rawName || typeof rawName !== "string")
      throw new Error("Ürün adı geçersiz!");
    if (!rawDesc || typeof rawDesc !== "string")
      throw new Error("Açıklama geçersiz!");
    if (!categoryId) throw new Error("Kategori seçilmedi!");

    const name = rawName.trim();
    const description = rawDesc.trim();
    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr) || 1;

    // --- KONTROL: BU ÜRÜN ZATEN VAR MI? ---
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" }, // İsim aynı mı?
        description: { equals: description }, // Açıklama aynı mı?
        isActive: true, // Aktif mi?
      },
    });

    if (existingProduct) {
      // VARSA -> STOK ARTIR
      console.log(`♻️ Ürün bulundu! Stok güncelleniyor...`);
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          stock: existingProduct.stock + stock,
          price: price, // Fiyatı da güncelle (isteğe bağlı)
        },
      });
    } else {
      // YOKSA -> YENİ OLUŞTUR
      console.log("✨ Yeni ürün oluşturuluyor...");

      // Resim Yükleme
      const files = formData.getAll("images") as File[];
      const imageUrls: string[] = [];

      if (files && files.length > 0) {
        const uploadDir = path.join(process.cwd(), "public/uploads");
        await mkdir(uploadDir, { recursive: true });

        for (const file of files) {
          if (file.size === 0) continue;
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const safeName = file.name
              .replace(/[^a-zA-Z0-9.]/g, "_")
              .toLowerCase();
            const fileName = `${Date.now()}-${safeName}`;
            const uploadPath = path.join(uploadDir, fileName);

            await writeFile(uploadPath, buffer);
            imageUrls.push(`/uploads/${fileName}`);
          } catch (err) {
            console.error("Resim hatası:", err);
          }
        }
      }

      await prisma.product.create({
        data: {
          name,
          description,
          price,
          stock,
          categoryId,
          isActive: true,
          images: imageUrls,
        },
      });
    }
  } catch (error: unknown) {
    console.error("Create Error:", error);
    let msg = "Sunucu hatası";
    if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }

  redirect("/admin/products");
}

// --- 2. FONKSİYON: MEVCUT ÜRÜNÜ GÜNCELLEME (EDIT SAYFASI İÇİN) ---
export async function updateProductAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim();
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;

    // Eski resimlerden kalanlar
    const keptImages = JSON.parse(
      (formData.get("keptImages") as string) || "[]"
    );

    // Yeni yüklenen resimler
    const files = formData.getAll("newImages") as File[];
    const newImageUrls: string[] = [];

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
          newImageUrls.push(`/uploads/${fileName}`);
        } catch (err) {
          console.error("Resim hatası:", err);
        }
      }
    }

    // Listeleri birleştir
    const finalImages = [...keptImages, ...newImageUrls];

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        images: finalImages,
      },
    });
  } catch (error: unknown) {
    console.error("Update Error:", error);
    let msg = "Güncelleme hatası";
    if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }

  redirect("/admin/products");
}
