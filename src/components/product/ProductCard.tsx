"use client";

<<<<<<< HEAD
import { ShoppingCart, Check, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import useCart from "@/hooks/use-cart";
// 👇 Favori butonu bileşenini import ettik
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    salePrice?: number | null;
    stock: number;
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const mainImageObj =
    product.images?.find((img) => img.isMain) || product.images?.[0];
  const imageUrl = mainImageObj ? mainImageObj.url : "/placeholder.png";

  // İndirim Hesaplaması
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;
=======
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
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
<<<<<<< HEAD

    cart.addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      imageUrl: imageUrl, // Sepette resim görünmesi için ekledim
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 hover:-translate-y-1 overflow-hidden">
      {/* --- GÖRSEL ALANI --- */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-gray-50">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105 ${
              product.stock <= 0 ? "opacity-60 grayscale" : ""
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* 🟢 FAVORİ BUTONU (Sağ Üst) */}
        <div className="absolute top-3 right-3 z-20 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <FavoriteButton productId={product.id} />
        </div>

        {/* İndirim Rozeti (Sol Üst) */}
        {hasDiscount && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
            İNDİRİM
          </div>
        )}

        {/* Tükendi Rozeti (Orta) */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[2px]">
            <div className="bg-white/90 border border-red-100 px-4 py-2 rounded-lg shadow-lg -rotate-3">
              <span className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs">
                <PackageX size={16} /> Tükendi
              </span>
            </div>
          </div>
        )}
      </div>

      {/* --- İÇERİK ALANI --- */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/products/${product.id}`} className="flex-1 space-y-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#667EEA] transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 h-[32px] leading-relaxed">
            {product.description || "Ürün detayları için tıklayınız."}
          </p>
        </Link>

        <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Fiyat
            </span>
            <div className="flex items-end gap-2 flex-wrap h-[32px]">
              {hasDiscount ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#667EEA]">
                      {currentPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs font-bold text-gray-500">TL</span>
                  </div>
                  <span className="text-sm text-gray-400 line-through decoration-red-400 mb-0.5">
                    {product.price.toLocaleString("tr-TR")} TL
                  </span>
                </>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-900">
                    {product.price.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs font-bold text-gray-500">TL</span>
                </div>
              )}
            </div>
          </div>

          {/* Sepete Ekle Butonu */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`
              relative w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all duration-300
              ${
                product.stock > 0
                  ? isAdded
                    ? "bg-green-500 text-white shadow-green-200"
                    : "bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white hover:bg-gradient-to-r hover:from-[#6b84f7] hover:to-[#8a5bb9] hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {product.stock > 0 ? (
              isAdded ? (
                <>
                  <Check size={16} strokeWidth={3} /> Eklendi
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Sepete Ekle
                </>
              )
            ) : (
              "Stok Yok"
            )}
          </button>
        </div>
      </div>
=======
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
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
    </div>
  );
}
