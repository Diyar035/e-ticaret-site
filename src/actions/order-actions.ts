"use server";

import { prisma } from "@/lib/prisma-client";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// --- TİP TANIMLAMALARI (Dönüş Değerleri İçin) ---
type ActionResponse = {
  success: boolean;
  message: string;
  count?: number; // Kaç kayıt güncellendiğini bilmek istersek
};

/**
 * ------------------------------------------------------------------
 * TOPLU SİPARİŞ DURUMU GÜNCELLEME (BULK UPDATE)
 * ------------------------------------------------------------------
 * Seçilen birden fazla siparişi tek seferde günceller.
 */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    if (!orderIds || orderIds.length === 0) {
      return { success: false, message: "Hiçbir sipariş seçilmedi." };
    }

    // Veritabanında güncelleme işlemi
    const result = await prisma.order.updateMany({
      where: {
        id: { in: orderIds }, // ID'si bu listenin içinde olanları bul
      },
      data: {
        status: newStatus,
      },
    });

    // Sayfayı yenile (Önbelleği temizle)
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard"); // Dashboard da güncellensin

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

/**
 * ------------------------------------------------------------------
 * TEKLİ SİPARİŞ DURUMU GÜNCELLEME (SINGLE UPDATE)
 * ------------------------------------------------------------------
 * Tek bir siparişin durumunu değiştirmek için.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/orders");

    return { success: true, message: "Sipariş durumu güncellendi." };
  } catch (error) {
    console.error("Tekli güncelleme hatası:", error);
    return { success: false, message: "Güncelleme başarısız oldu." };
  }
}