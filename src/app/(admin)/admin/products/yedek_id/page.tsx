import { prisma } from "@/lib/prisma-client";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/EditProductForm";

// Verilerin her zaman taze gelmesi için önbelleği kapatıyoruz
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Ürünü Veritabanından Bul (Ham Veri)
  const productRaw = await prisma.product.findUnique({
    where: { id },
  });

  // Ürün yoksa 404 sayfasına git
  if (!productRaw) return notFound();

  // --- KRİTİK DÜZELTME BURADA ---
  // Prisma'dan gelen 'Date' (Tarih) objeleri Client Component'e geçerken hata verir.
  // Bu yüzden sadece formun ihtiyacı olan verileri temiz bir pakete koyuyoruz.
  const product = {
    id: productRaw.id,
    name: productRaw.name,
    description: productRaw.description,
    price: productRaw.price,
    stock: productRaw.stock,
    categoryId: productRaw.categoryId,
    images: productRaw.images,
  };
  // ------------------------------

  // 2. Kategorileri Çek (Seçim Kutusu İçin)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Ürünü Düzenle
      </h1>

      {/* Temizlenmiş veriyi forma gönderiyoruz */}
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
