'use server'

import prisma from "@/lib/prisma" // Prisma client yolun neredeyse orası (lib/prisma.ts veya db.ts)

// 1. Admin için: Kupon Oluşturma
export async function createCoupon(data: {
  code: string;
  discountRate: number;
  maxUses: number;
  categoryId: string;
}) {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(), // Kodları hep büyük harf yapalım
        discountRate: data.discountRate,
        maxUses: data.maxUses,
        categoryId: data.categoryId
      }
    });
    return { success: true, coupon };
  } catch (error) {
    return { success: false, error: "Kupon oluşturulamadı." };
  }
}

// 2. Sepet için: Kupon Doğrulama
export async function validateCoupon(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { category: true } // Kategori bilgisini de çekiyoruz
    });

    if (!coupon) return { success: false, message: "Geçersiz kupon kodu." };
    if (!coupon.isActive) return { success: false, message: "Bu kupon pasif durumda." };
    if (coupon.usedCount >= coupon.maxUses) return { success: false, message: "Kupon kullanım limiti dolmuş." };

    return { success: true, coupon };
  } catch (error) {
    return { success: false, message: "Bir hata oluştu." };
  }
}