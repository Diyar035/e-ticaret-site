"use client";

import { ShoppingCart, AlertTriangle } from "lucide-react"; // Uyarı ikonu
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "@/context/cart/index";

// Ürün Tipi Tanımı
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category_id: string;
  is_featured: boolean;
  created_at: string;
  old_price?: number;
  category_title?: string;
  category_slug?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addToCart(product as any);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-transparent relative overflow-hidden">
      {/* Resim Alanı */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <Link href={`/urun/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={192}
            height={226}
            // Stok yoksa resmi siyah-beyaz yap
            className={`w-full h-48 object-cover rounded-xl transition-transform duration-300 ${product.stock > 0 ? "group-hover:scale-105" : "grayscale opacity-80"}`}
            unoptimized
          />
        </Link>

        {/* --- STOK DURUMU (SAYISIZ - SADECE UYARI) --- */}
        {product.stock <= 0 ? (
          // DURUM 1: STOK YOK (Kırmızı - Tükendi)
          <div
            className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase rounded bg-red-500 text-white shadow-sm z-10 cursor-help"
            title="Stok kalmadı"
          >
            Tükendi
          </div>
        ) : product.stock <= 5 ? (
          // DURUM 2: KRİTİK STOK (Turuncu - Tükenmek Üzere - SAYI YOK)
          <div
            className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase rounded bg-orange-500 text-white shadow-sm z-10 flex items-center gap-1 cursor-help"
            title="Acele et, bitiyor!"
          >
            <AlertTriangle size={12} /> Tükenmek Üzere
          </div>
        ) : // DURUM 3: STOK BOL (Hiçbir şey yazmaz, temiz kalır)
        null}
        {/* ------------------------------------------- */}
      </div>

      {/* Ürün İsmi */}
      <Link href={`/urun/${product.id}`}>
        <h3 className="font-semibold text-gray-800 truncate mb-2 hover:text-blue-600 transition">
          {product.name}
        </h3>
      </Link>

      {/* Fiyat */}
      <div className="flex items-center gap-2">
        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
          {product.price.toLocaleString("tr-TR", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₺
        </p>

        {product.old_price && product.old_price > product.price && (
          <span className="text-xs text-gray-400 line-through">
            {product.old_price.toLocaleString("tr-TR")} ₺
          </span>
        )}
      </div>

      {/* Sepete Ekle Butonu */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`mt-3 w-full py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-white
            ${
              product.stock > 0
                ? "bg-gradient-to-r from-[#667EEA] to-[#764BA2] hover:scale-[1.02]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
      >
        <ShoppingCart size={18} />
        {product.stock > 0 ? "Sepete Ekle" : "Stokta Yok"}
      </button>
    </div>
  );
}
