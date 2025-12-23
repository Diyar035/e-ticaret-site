"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

// 1. Tekli Silme
export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
    return { success: true, message: "Ürün silindi." };
  } catch (error) {
    console.error("Delete Error:", error); // 🔥 Hata giderildi
    return { success: false, message: "Silinemedi." };
  }
}

// 2. Tekli Arşivleme (Toggle)
export async function toggleProductArchive(
  productId: string,
  isArchived: boolean
) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        isArchived,
        ...(isArchived ? { isActive: false } : {}), // Arşivleniyorsa satışa kapa
      },
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: isArchived ? "Arşivlendi." : "Geri yüklendi.",
    };
  } catch (error) {
    console.error("Archive Toggle Error:", error); // 🔥 Hata giderildi
    return { success: false, message: "Güncellenemedi." };
  }
}

// 3. Toplu Arşivleme
export async function bulkArchiveProducts(ids: string[], isArchived: boolean) {
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: {
        isArchived,
        ...(isArchived ? { isActive: false } : {}),
      },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Bulk Archive Error:", error); // 🔥 Hata giderildi
    return { success: false, error: "Toplu işlem hatası." };
  }
}

// 4. Toplu Silme
export async function bulkDeleteProducts(ids: string[]) {
  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Bulk Delete Error:", error); // 🔥 Hata giderildi
    return { success: false, error: "Toplu silme hatası." };
  }
}

// 5. Toplu Satış Durumu
export async function bulkUpdateStatus(ids: string[], isActive: boolean) {
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Bulk Status Error:", error); // 🔥 Hata giderildi
    return { success: false, error: "Durum güncellenemedi." };
  }
}
