import { prisma } from "@/lib/prisma-client";
import NewProductForm from "@/components/admin/NewProductForm";

// Sayfanın her seferinde taze veri çekmesini zorluyoruz (Cache'i kapatıyoruz)
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  // 1. Kategorileri Çek (Sadece Ana Kategoriler)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true }, // Alt kategorileri de al
    orderBy: { name: "asc" },
  });

  // Konsola yazdır ki verinin geldiğini görelim (VS Code terminaline bakarız)
  console.log("📢 [Server] Çekilen Ana Kategori Sayısı:", categories.length);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-20 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Yeni Ürün Ekle
      </h1>

      {/* 2. Veriyi Forma Gönder */}
      <NewProductForm categories={categories} />
    </div>
  );
}
