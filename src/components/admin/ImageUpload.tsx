"use client";

import { useState, useRef, useEffect } from "react";
import { X, Star, UploadCloud } from "lucide-react";
import Image from "next/image";

// Prop tanımı ekledik
export default function ImageUpload({
  onFilesChange,
}: {
  onFilesChange?: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State değişince üst bileşene (Form'a) haber ver
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files);
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    // Inputu temizle ki aynı dosyayı tekrar seçebilsin
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const makeMain = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.unshift(moved);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Ürün Resimleri
      </label>

      {/* Tıklanabilir Alan */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
      >
        <UploadCloud className="text-blue-500 mb-2" size={32} />
        <p className="text-gray-600">Resim Seçmek İçin Tıkla</p>
        <p className="text-xs text-gray-400">JPG, PNG veya WEBP</p>

        {/* Gizli Input (name özelliği artık önemli değil çünkü elle yönetiyoruz) */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Önizlemeler */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden border ${index === 0 ? "ring-2 ring-blue-500" : ""}`}
            >
              <Image
                src={url}
                alt="preview"
                fill
                className="object-cover"
                unoptimized
              />

              {index === 0 && (
                <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
                  Ana Resim
                </span>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(index)}
                    className="bg-white p-1 rounded-full text-green-600"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-white p-1 rounded-full text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
