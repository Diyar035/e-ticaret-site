"use client";

import { useState } from "react";
import ClientCategorySection from "@/app/(admin)/admin/products/new/ClientCategorySection";
import ImageUpload from "@/components/admin/ImageUpload";
import { updateProductAction } from "@/actions/product-actions";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";

// --- TİP TANIMLARI (DÜZELTİLDİ) ---
type Category = {
  id: string;
  name: string;
  children: { id: string; name: string }[];
};

// Admin panelinin beklediği 'Saf' ürün tipi (Veritabanı formatı)
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string; // category_id DEĞİL, categoryId
  images: string[]; // image_url DEĞİL, images dizisi
};

export default function EditProductForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);

  // Güvenlik kontrolü: product veya images null gelirse boş dizi yap
  const [currentImages, setCurrentImages] = useState<string[]>(
    product?.images || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Eğer ürün verisi yoksa yükleniyor göster
  if (!product) return <div className="p-4">Ürün verisi yükleniyor...</div>;

  const removeCurrentImage = (urlToRemove: string) => {
    setCurrentImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Gereksizleri temizle, doğruları ekle
      formData.delete("images");
      formData.append("keptImages", JSON.stringify(currentImages));

      newFiles.forEach((file) => {
        formData.append("newImages", file);
      });

      formData.append("id", product.id);

      await updateProductAction(formData);
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
      {/* Ürün Adı */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ürün Adı
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={product.name}
          className="w-full border p-2 rounded-md"
        />
      </div>

      {/* Açıklama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          name="description"
          required
          defaultValue={product.description}
          className="w-full border p-2 rounded-md"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fiyat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat (TL)
          </label>
          <input
            name="price"
            type="number"
            required
            defaultValue={product.price}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Stok */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok Adedi
          </label>
          <input
            name="stock"
            type="number"
            required
            defaultValue={product.stock}
            min={0}
            className="w-full border p-2 rounded-md"
          />
        </div>
      </div>

      {/* Kategori Seçici */}
      <ClientCategorySection
        categories={categories}
        initialCategoryId={product.categoryId}
      />

      {/* Resim Alanı */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
        <label className="block text-sm font-bold text-gray-700">
          Mevcut Resimler
        </label>

        {currentImages.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {currentImages.map((img, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden group"
              >
                <Image
                  src={img}
                  alt="product"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeCurrentImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                  title="Resmi Kaldır"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500 italic">⚠️ Şu an hiç resim yok.</p>
        )}

        <div className="pt-4 border-t mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">
            Yeni Resim Ekle
          </p>
          <ImageUpload onFilesChange={(files) => setNewFiles(files)} />
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? "Güncelleniyor..." : "Güncelle"}
        </button>

        <Link
          href="/admin/products"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 text-center flex items-center justify-center"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
