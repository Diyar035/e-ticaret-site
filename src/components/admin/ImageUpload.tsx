"use client";

import { useState, useRef, useEffect } from "react";
import { X, Star, UploadCloud } from "lucide-react";
import Image from "next/image";

// Üst bileşene veri göndermek için Prop tanımı
export default function ImageUpload({
  onFilesChange,
}: {
  onFilesChange?: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya listesi değiştiğinde çalışır
  useEffect(() => {
    // 1. Üst forma dosyaları gönder
    if (onFilesChange) {
      onFilesChange(files);
    }

    // 2. Önizlemeleri oluştur
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Temizlik (Memory Leak önlemi)
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      // Yeni gelenleri mevcutların üstüne ekle
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    // Inputu temizle ki aynı dosyayı peş peşe seçebilsin
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const makeMain = (index: number) => {
    if (index === 0) return; // Zaten ana resimse işlem yapma
    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1); // Seçileni al
    newFiles.unshift(moved); // En başa koy
    setFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Ürün Resimleri
      </label>

      {/* Tıklanabilir Seçim Alanı */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition bg-gray-50"
      >
        <UploadCloud className="text-blue-500 mb-2" size={32} />
        <p className="text-gray-600 font-medium">Resim Seçmek İçin Tıkla</p>
        <p className="text-xs text-gray-400">
          JPG, PNG veya WEBP (Çoklu seçim desteklenir)
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Önizleme Listesi */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === 0 ? "border-green-500 shadow-md" : "border-gray-200"}`}
            >
              <Image
                src={url}
                alt="preview"
                fill
                className="object-cover"
                unoptimized
              />

              {index === 0 && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                  ANA RESİM
                </span>
              )}

              {/* Butonlar (Hover ile görünür) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-[1px]">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(index)}
                    className="bg-white p-2 rounded-full text-green-600 hover:bg-green-50"
                    title="Ana Resim Yap"
                  >
                    <Star size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50"
                  title="Sil"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
