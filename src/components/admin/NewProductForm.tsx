"use client";

import { useState } from "react";
import ClientCategorySection from "@/app/(admin)/admin/products/new/ClientCategorySection";
import ImageUpload from "@/components/admin/ImageUpload";
import { createProductAction } from "@/actions/product-actions";

type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[];
};

export default function NewProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Tarayıcının 'images' verisini silip, bizim state'deki dosyaları ekliyoruz
      formData.delete("images");

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      await createProductAction(formData);
    } catch (error: unknown) {
      console.error("Form Hatası:", error);
      let errorMessage = "Bilinmeyen bir hata oluştu.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`HATA: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. ÜRÜN ADI (GERİ GELDİ) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ürün Adı
        </label>
        <input
          name="name"
          type="text"
          required
          className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: iPhone 15 Pro"
        />
      </div>

      {/* 2. AÇIKLAMA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          name="description"
          required
          className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Ürün detayları..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 3. FİYAT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat (TL)
          </label>
          <input
            name="price"
            type="number"
            required
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* 4. STOK ADEDİ (GERİ GELDİ) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok Adedi
          </label>
          <input
            name="stock"
            type="number"
            required
            defaultValue={1}
            min={0}
            className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 5. KATEGORİ SEÇİCİ */}
      <ClientCategorySection categories={categories} />

      {/* 6. RESİM YÜKLEYİCİ */}
      <ImageUpload onFilesChange={(files) => setSelectedFiles(files)} />

      {/* 7. KAYDET BUTONU */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
