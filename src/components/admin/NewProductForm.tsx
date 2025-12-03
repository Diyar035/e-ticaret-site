"use client";

import { useState } from "react";
// YOL DÜZELTMESİ: Eğer ClientCategorySection aynı yerdeyse yolu kontrol et
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

      // --- KRİTİK NOKTA ---
      // Tarayıcının kendi topladığı 'images' verisini silip,
      // bizim ImageUpload bileşeninden gelen sağlam dosyaları ekliyoruz.
      formData.delete("images");

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await createProductAction(formData);
    } catch (error: unknown) {
      let msg = "Hata oluştu";
      if (error instanceof Error) msg = error.message;
      alert(`HATA: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ürün Adı
        </label>
        <input
          name="name"
          type="text"
          required
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          name="description"
          required
          className="w-full border p-2 rounded-md"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fiyat
        </label>
        <input
          name="price"
          type="number"
          required
          className="w-full border p-2 rounded-md"
        />
      </div>

      {/* Kategori Seçici */}
      <ClientCategorySection categories={categories} />

      {/* Resim Yükleyici - Dosyaları state'e atıyoruz */}
      <ImageUpload onFilesChange={(files) => setSelectedFiles(files)} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
