import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma-client";
import ArchiveProductButton from "@/components/admin/ArchiveProductButton";
import { Pencil, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  // Veritabanından ürünleri çekiyorum.
  // Sadece 'isActive: true' olanları getiriyorum ki arşivdekiler burada kalabalık yapmasın.
  // Ayrıca kategori ismini göstermek için 'include' kullandım.
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }, // En son eklenen en üstte görünsün
  });

  return (
    <div className="p-8">
      {/* Üst Kısım: Başlık ve Butonlar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>

        <div className="flex gap-3">
          {/* Çöp Kutusuna Gitme Butonu */}
          <Link
            href="/admin/products/archive"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <Trash2 size={18} /> Arşiv / Çöp Kutusu
          </Link>

          {/* Yeni Ürün Ekleme Sayfasına Gitme Butonu */}
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {/* Ürün Listesi Tablosu */}
      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          {/* Tablo Başlıkları */}
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Resim</th>
              <th className="p-3">Ürün Adı</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>

          {/* Tablo İçeriği (Döngü ile ürünleri basıyorum) */}
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                {/* 1. Ürün Resmi */}
                <td className="p-3">
                  {/* Eğer ürünün resmi varsa göster, yoksa gri boş kutu göster (Hata almamak için) */}
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded border"
                      unoptimized // Dışarıdan yüklenen resimlerde sorun çıkmasın diye
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  )}
                </td>

                {/* 2. Ürün Adı */}
                <td className="p-3 font-medium">{product.name}</td>

                {/* 3. Stok Durumu */}
                <td className="p-3">
                  {/* Stok durumuna göre renk değişimi yapıyorum. Stok varsa Mavi, yoksa Kırmızı uyarı veriyor. */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      product.stock > 0
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock} Adet
                  </span>
                </td>

                {/* 4. Kategori Bilgisi */}
                <td className="p-3 text-gray-600">
                  {/* Kategori silinmişse hata vermesin diye kontrol koydum */}
                  {product.category?.name || "-"}
                </td>

                {/* 5. Fiyat */}
                <td className="p-3 text-green-600 font-bold">
                  {product.price} TL
                </td>

                {/* 6. İşlem Butonları (Düzenle ve Arşivle) */}
                <td className="p-3 text-right flex justify-end gap-2 items-center">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                    title="Düzenle"
                  >
                    <Pencil size={20} />
                  </Link>
                  {/* Bu buton Client Component olduğu için ayrı dosyadan çağırdım */}
                  <ArchiveProductButton id={product.id} />
                </td>
              </tr>
            ))}

            {/* Eğer hiç ürün yoksa boş ekran kalmasın, uyarı versin */}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Şu an yayında olan ürün yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
