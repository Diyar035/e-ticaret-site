"use client";

import Link from "next/link";
import { Edit, Trash2, ArrowRight, Box } from "lucide-react";
import { Prisma } from "@prisma/client";

// Veri tipini Prisma'dan gelen veriye göre tanımlıyoruz
type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: { parent: true; _count: { select: { products: true } } };
}>;

interface CategoryDataTableProps {
  categories: CategoryWithRelations[];
}

export default function CategoryDataTable({
  categories,
}: CategoryDataTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-700">
              Kategori Adı
            </th>
            <th className="px-6 py-4 font-semibold text-gray-700">Türü</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-center">
              Ürün Sayısı
            </th>
            <th className="px-6 py-4 font-semibold text-gray-700">
              Oluşturulma Tarihi
            </th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-right">
              İşlemler
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr
              key={category.id}
              className="hover:bg-gray-50/60 transition-colors group"
            >
              {/* İsim ve Görsel/İkon */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Box size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {category.name}
                    </div>
                    {/* description alanı veritabanında olmadığı için kaldırıldı */}
                  </div>
                </div>
              </td>

              {/* Türü (Ana/Alt) */}
              <td className="px-6 py-4">
                {category.parentId ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Alt Kategori
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <ArrowRight size={12} /> {category.parent?.name}
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Ana Kategori
                  </span>
                )}
              </td>

              {/* Ürün Sayısı */}
              <td className="px-6 py-4 text-center">
                <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                  {category._count.products}
                </span>
              </td>

              {/* Tarih */}
              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                {formatDate(category.createdAt)}
              </td>

              {/* İşlemler */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                    onClick={() => alert("Silme fonksiyonu buraya bağlanacak")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
