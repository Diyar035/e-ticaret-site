"use server";

import { prisma } from "@/lib/prisma-client";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// İşlem sonuçlarını dönerken kullandığımız standart yapı
type ActionResponse = {
  success: boolean;
  message: string;
  count?: number;
};

/**
 * ------------------------------------------------------------------
 * TEKLİ SİPARİŞ DURUMU GÜNCELLEME
 * ------------------------------------------------------------------
 * Sipariş detay sayfasındaki butonlara basınca burası tetikleniyor.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    // Veritabanına gidip siparişin statüsünü güncelliyoruz
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Değişikliği anında ekranda görelim diye yolu yeniliyoruz
    revalidatePath("/admin/orders");

    return { success: true, message: "Sipariş statüsü mis gibi güncellendi." };
  } catch (error) {
    console.error("Tekli güncelleme yaparken bir hata aldık:", error);
    return { success: false, message: "Güncelleme maalesef başarısız oldu." };
  }
}

/**
 * ------------------------------------------------------------------
 * TOPLU SİPARİŞ DURUMU GÜNCELLEME
 * ------------------------------------------------------------------
 * Listeden birden fazla sipariş seçip durum değiştirmek için kullanıyoruz.
 */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    if (!orderIds || orderIds.length === 0) {
      return { success: false, message: "Hacı hiçbir sipariş seçmemişsin!" };
    }

    // Seçilen tüm ID'lerin durumunu toplu olarak değiştiriyoruz
    const result = await prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: `${result.count} sipariş başarıyla ${newStatus} durumuna getirildi.`,
      count: result.count,
    };
  } catch (error) {
    console.error("Toplu güncelleme hatası:", error);
    return {
      success: false,
      message: "İşlem sırasında sunucu tarafında bir hata oluştu.",
    };
  }
}
