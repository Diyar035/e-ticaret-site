"use server";

import { prisma } from "@/lib/prisma-client";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// İşlem sonuçlarını geri döndürmek için kullandığımız tip
type ActionResponse = {
  success: boolean;
  message: string;
  count?: number;
};

/**
 * Birden fazla siparişi aynı anda güncelliyoruz
 * Panonun solundaki kutucukları seçip toplu işlem yapınca burası çalışıyor
 */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    if (!orderIds || orderIds.length === 0) {
      return { success: false, message: "Hacı hiçbir sipariş seçmedin ki!" };
    }

    // Seçilen tüm ID'leri veritabanında bulup yeni statüyü basıyoruz
    const result = await prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data: {
        status: newStatus,
      },
    });

    // Sayfalar güncellensin, eski veri kalmasın diye buraları tazeliyoruz
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `${result.count} tane sipariş artık ${newStatus} durumunda.`,
      count: result.count,
    };
  } catch (error) {
    console.error("Toplu güncelleme yaparken patladık:", error);
    return {
      success: false,
      message:
        "Sunucu tarafında bir şeyler ters gitti, toplu güncelleme olmadı.",
    };
  }
}

/**
 * Tek bir siparişin durumunu değiştiren fonksiyon
 * Detay sayfasındaki butonlara basınca aslında burayı çağırıyoruz
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResponse> {
  try {
    // ID'yi bulup durumu set ediyoruz
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Değişikliği anında görelim diye yolu tazeleyelim
    revalidatePath("/admin/orders");

    return { success: true, message: "Siparişin durumu mis gibi güncellendi." };
  } catch (error) {
    console.error("Tekli güncelleme hatası aldık:", error);
    return { success: false, message: "Maalesef durumu güncelleyemedik." };
  }
}
