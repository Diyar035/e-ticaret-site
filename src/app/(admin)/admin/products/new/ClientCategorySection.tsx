"use client";

import { useState } from "react";
import CategorySelector from "@/components/admin/CategorySelector";

type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[];
};

// --- DÜZELTME BURADA: initialCategoryId EKLENDİ ---
export default function ClientCategorySection({
  categories,
  initialCategoryId,
}: {
  categories: Category[];
  initialCategoryId?: string; // Soru işareti opsiyonel demek
}) {
  const [selectedId, setSelectedId] = useState(initialCategoryId || "");

  return (
    <div className="w-full bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📂 Kategori Belirle
      </h3>

      <CategorySelector
        categories={categories}
        initialSelectedId={initialCategoryId} // Selector'a iletiyoruz
        onSelect={(id) => setSelectedId(id)}
      />

      <input type="hidden" name="categoryId" value={selectedId} />

      {!selectedId && (
        <p className="text-xs text-orange-500 mt-2 font-medium">
          * Lütfen ürünün ekleneceği alt kategoriyi seçiniz.
        </p>
      )}
    </div>
  );
}
