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

      // Tarayıcının verisini silip kendi dosyalarımızı ekliyoruz
      formData.delete("images");
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      await createProductAction(formData);
    } catch (error: unknown) {
      console.error("Form Gönderme Hatası:", error);
      let errorMessage = "Bilinmeyen bir hata oluştu.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`HATA OLUŞTU: ${errorMessage}`);
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
          placeholder="Örn: iPhone 13"
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
          placeholder="Ürün detayları..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fiyat (TL)
        </label>
        <input
          name="price"
          type="number"
          required
          className="w-full border p-2 rounded-md"
          placeholder="0.00"
        />
      </div>

      <ClientCategorySection categories={categories} />

      <ImageUpload onFilesChange={(files) => setSelectedFiles(files)} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-blue-300"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
