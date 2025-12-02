"use client";

import { useState, useEffect } from "react";
import CategorySelector from "@/components/admin/CategorySelector";

type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[];
};

// YENİLİK: 'initialCategoryId' diye bir prop ekledik (Varsayılan Kategori)
export default function ClientCategorySection({
  categories,
  initialCategoryId,
}: {
  categories: Category[];
  initialCategoryId?: string; // Bu opsiyonel, yeni ürün eklerken boş gelir
}) {
  const [selectedId, setSelectedId] = useState(initialCategoryId || "");

  // Eğer dışarıdan initialCategoryId gelirse state'i güncelle (Edit sayfası için)
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedId(initialCategoryId);
    }
  }, [initialCategoryId]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-3">Kategori Belirle</h3>

      {/* Selector bileşenine de initial değer yollamak lazım ama şimdilik */}
      {/* basit tutmak için görsel olarak seçili gelmesini manual yapıyoruz */}
      <CategorySelector
        categories={categories}
        onSelect={(id) => setSelectedId(id)}
      />

      {/* Eğer düzenleme modundaysak ve kullanıcı henüz değiştirmediyse eski ID kalır */}
      <input type="hidden" name="categoryId" value={selectedId} />

      <div className="mt-2 text-xs text-gray-500">
        Seçili Kategori ID: {selectedId || "Henüz seçilmedi"}
      </div>
    </div>
  );
}
