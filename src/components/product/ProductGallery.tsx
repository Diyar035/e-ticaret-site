"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  // Eğer veritabanında resim yoksa placeholder göster
  // images undefined veya null gelirse boş dizi [] kabul et
  const validImages = Array.isArray(images) ? images : [];
  const imageList = validImages.length > 0 ? validImages : ["/placeholder.png"];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* --- BÜYÜK ANA RESİM --- */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-100 bg-white shadow-sm">
        <Image
          src={imageList[selectedIndex]}
          alt={productName}
          fill
          className="object-contain p-2" // Resmi kesmeden sığdırır
          unoptimized // Yerel dosyalar için şart
        />
        {/* Debug Bilgisi (Sadece test için, sonra silersin) */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {selectedIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* --- KÜÇÜK RESİMLER (THUMBNAILS) --- */}
      {/* Burada length kontrolünü kaldırdık, 1 tane bile olsa görünsün ki çalıştığını anlayalım */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {imageList.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all 
              ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-100 scale-95 opacity-100" // Seçili
                  : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400" // Seçili Değil
              }`}
          >
            <Image
              src={img}
              alt={`thumbnail-${index}`}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Bilgi Mesajı */}
      <p className="text-xs text-gray-400 text-center">
        Toplam {imageList.length} görsel yüklendi.
      </p>
    </div>
  );
}
