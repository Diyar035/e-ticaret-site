import Link from "next/link";
import Image from "next/image"; // <-- YENİ EKLENDİ
import { prisma } from "@/lib/prisma-client";
import ArchiveProductButton from "@/components/admin/ArchiveProductButton";
import { Pencil, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>

        <div className="flex gap-3">
          <Link
            href="/admin/products/archive"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <Trash2 size={18} /> Arşiv / Çöp Kutusu
          </Link>

          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Resim</th>
              <th className="p-3">Ürün Adı</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                {/* 1. RESİM KISMI GÜNCELLENDİ */}
                <td className="p-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40} // Next.js boyut bilmek ister
                      height={40} // Next.js boyut bilmek ister
                      className="object-cover rounded border"
                      unoptimized // Eğer dışarıdan rastgele link geliyorsa hata vermesin diye (Geliştirme aşaması için)
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  )}
                </td>

                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-gray-600">
                  {product.category?.name || "-"}
                </td>
                <td className="p-3 text-green-600 font-bold">
                  {product.price} TL
                </td>
                <td className="p-3 text-right flex justify-end gap-2 items-center">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                    title="Düzenle"
                  >
                    <Pencil size={20} />
                  </Link>
                  <ArchiveProductButton id={product.id} />
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
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
