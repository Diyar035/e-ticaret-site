import { prisma } from "@/lib/prisma-client";
import { redirect } from "next/navigation";
import ClientCategorySection from "../new/ClientCategorySection"; // Aynı bileşeni kullanıyoruz
import { Link } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  // 1. URL'den ID'yi al
  const { id } = await params;

  // 2. Ürünü Veritabanından Bul
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return <div className="p-10">Ürün bulunamadı!</div>;
  }

  // 3. Kategorileri Çek (Dropdown için)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  // 4. GÜNCELLEME İŞLEMİ (Server Action)
  async function updateProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "on"; // Checkbox kontrolü

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        isActive,
      },
    });

    redirect("/admin/products");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ürünü Düzenle</h1>

      <form action={updateProduct} className="space-y-6">
        {/* Ürün Adı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ürün Adı
          </label>
          <input
            name="name"
            type="text"
            defaultValue={product.name}
            required
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            name="description"
            defaultValue={product.description}
            required
            rows={3}
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fiyat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat (TL)
          </label>
          <input
            name="price"
            type="number"
            defaultValue={product.price}
            required
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Aktif/Pasif Durumu */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked={product.isActive}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <label htmlFor="isActive" className="text-gray-700 font-medium">
            Bu ürün satışta (Aktif)
          </label>
        </div>

        {/* Kategori Seçici (Mevcut ID'yi yolluyoruz) */}
        <ClientCategorySection
          categories={categories}
          initialCategoryId={product.categoryId}
        />

        {/* Butonlar */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Güncelle
          </button>
          
           <Link href="/admin/products"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
          
           İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
