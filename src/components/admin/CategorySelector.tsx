"use client";

import { useState, useEffect } from "react";

// Veri Tipi
type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[];
};

type Props = {
  categories: Category[];
  initialSelectedId?: string;
  onSelect: (id: string) => void;
};

export default function CategorySelector({
  categories,
  initialSelectedId,
  onSelect,
}: Props) {
  // Veri güvenliği: Eğer categories null/undefined gelirse boş dizi yap
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [selectedMainId, setSelectedMainId] = useState("");
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedSubId, setSelectedSubId] = useState("");

  // 1. Ana Kategori Seçilince Çalışan Fonksiyon
  const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainId = e.target.value;
    setSelectedMainId(mainId);

    // Alt kısmı sıfırla
    setSelectedSubId("");
    setSubCategories([]);
    onSelect(""); // Form verisini temizle

    // Alt kategorileri bul ve doldur
    const found = safeCategories.find((c) => c.id === mainId);
    if (found && found.children) {
      setSubCategories(found.children);
    }
  };

  // 2. Alt Kategori Seçilince Çalışan Fonksiyon
  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setSelectedSubId(subId);
    onSelect(subId); // Form verisini güncelle
  };

  // 3. Başlangıç Değeri Varsa (Düzenleme Modu) Otomatik Doldur
  useEffect(() => {
    if (initialSelectedId && safeCategories.length > 0 && !selectedMainId) {
      for (const mainCat of safeCategories) {
        const foundSub = mainCat.children?.find(
          (sub) => sub.id === initialSelectedId
        );
        if (foundSub) {
          setSelectedMainId(mainCat.id);
          setSubCategories(mainCat.children);
          setSelectedSubId(initialSelectedId);
          onSelect(initialSelectedId);
          break;
        }
      }
    }
  }, [initialSelectedId, safeCategories, onSelect, selectedMainId]);

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
      {/* --- DEBUG BİLGİSİ (Sorunu anlamak için ekledik) --- */}
      <div className="text-xs text-gray-400 mb-2">
        Sistem Durumu: {safeCategories.length} Ana Kategori Yüklendi.
      </div>
      {/* -------------------------------------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SOL KUTU: ANA KATEGORİ */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Ana Kategori Seç
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            value={selectedMainId}
            onChange={handleMainChange}
          >
            <option value="">-- Lütfen Seçiniz --</option>
            {safeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SAĞ KUTU: ALT KATEGORİ */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Alt Kategori Seç
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:bg-gray-200 disabled:text-gray-400"
            value={selectedSubId}
            onChange={handleSubChange}
            disabled={!selectedMainId || subCategories.length === 0}
          >
            <option value="">
              {!selectedMainId
                ? "← Önce Sol Tarafı Seçin"
                : subCategories.length === 0
                  ? "Alt kategori bulunamadı"
                  : "-- Seçiniz --"}
            </option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
