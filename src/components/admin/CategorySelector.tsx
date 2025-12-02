"use client";

import { useState } from "react";

// Veritabanından gelen kategori tipi
type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[]; // Alt kategorileri
};

type Props = {
  categories: Category[]; // Tüm kategoriler buraya gelecek
  // Seçim yapıldığında ID'yi üst forma bildirecek fonksiyon
  onSelect: (id: string) => void;
};

export default function CategorySelector({ categories, onSelect }: Props) {
  const [selectedMainId, setSelectedMainId] = useState("");
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedSubId, setSelectedSubId] = useState("");

  // 1. Ana Kategori Seçilince
  const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainId = e.target.value;
    setSelectedMainId(mainId);

    // Alt seçimleri sıfırla
    setSelectedSubId("");
    setSubCategories([]);
    onSelect(""); // Formdaki değeri temizle

    // Seçilen ana kategorinin altlarını bul ve listeye yükle
    const found = categories.find((c) => c.id === mainId);
    if (found && found.children.length > 0) {
      setSubCategories(found.children);
    }
  };

  // 2. Alt Kategori Seçilince
  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setSelectedSubId(subId);
    onSelect(subId); // İşte bu ID veritabanına gidecek!
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* SOL KUTU: ANA KATEGORİ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ana Kategori
        </label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedMainId}
          onChange={handleMainChange}
        >
          <option value="">Lütfen Seçiniz...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* SAĞ KUTU: ALT KATEGORİ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alt Kategori
        </label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
          value={selectedSubId}
          onChange={handleSubChange}
          disabled={!selectedMainId || subCategories.length === 0} // Ana kategori seçilmezse kilitli kalsın
        >
          <option value="">
            {!selectedMainId
              ? "← Önce Ana Kategoriyi Seç"
              : "Alt Kategori Belirle..."}
          </option>
          {subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
