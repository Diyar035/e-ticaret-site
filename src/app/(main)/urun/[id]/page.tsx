import { prisma } from "@/lib/prisma-client";
import {
  Award,
  Check,
  Clock,
  Heart,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

// Next.js 15 için Props tipi
type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Dinamik Meta Veri (SEO)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: "Ürün bulunamadı",
      description: "Aradığınız ürün bulunamadı",
    };
  }

  return {
    title: `${product.name} | KervanPazar`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: [product.images[0] || ""],
      title: `${product.name} | KervanPazar`,
      description: product.description?.substring(0, 160),
    },
  };
}

/**
 * Ürün Detay Sayfası
 */
export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // 1. Ürünü Veritabanından Çek
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!dbProduct) {
    notFound();
  }

  // 2. VERİ DÖNÜŞTÜRME (Mapping)
  // Burası çok önemli, virgüllere dikkat!
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    image_url: dbProduct.images[0] || "https://via.placeholder.com/600",

    // İlişkili veriler
    category_id: dbProduct.categoryId,
    subcategory_name: dbProduct.category?.name || "Genel",

    // Tasarımın bozulmaması için doldurduğumuz alanlar:
    brand: "KervanPazar",
    rating: 5,
    stock: 50,
    old_price: dbProduct.price * 1.25,

    // TypeScript hatasını çözen eksik alanlar:
    is_featured: false,
    created_at: dbProduct.createdAt.toISOString(),
  };

  // Sabit özellikler listesi
  const features = [
    { icon: Truck, text: "Ücretsiz Kargo", subtext: "300 TL ve üzeri" },
    { icon: Shield, text: "Güvenli Ödeme", subtext: "256-bit SSL" },
    { icon: RotateCcw, text: "Kolay İade", subtext: "14 gün içinde" },
    { icon: Clock, text: "Hızlı Teslimat", subtext: "1-3 iş günü" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Üst Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3">
        <div className="container mx-auto px-4 text-center text-sm">
          🚀 <strong>Özel Fırsat!</strong> Bu üründe 12 aya varan taksit
          seçenekleri ve ücretsiz kargo!
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-3 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Ana Sayfa
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500">Ürünler</span>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500 hover:text-indigo-600 transition-colors capitalize">
              {product.subcategory_name}
            </span>
            <span className="text-gray-300">›</span>
            <span className="text-gray-900 font-medium truncate max-w-40">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          {/* SOL TARAF: Resimler */}
          <div className="xl:col-span-7">
            <div className="sticky top-8 space-y-6">
              {/* Büyük Resim */}
              <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-white group">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4"
                />

                {/* İndirim Badge */}
                {product.old_price && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      -%
                      {Math.round(
                        (1 - product.price / product.old_price) * 100
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Küçük Resimler */}
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg bg-white flex-shrink-0 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500"
                  >
                    <Image
                      src={product.image_url}
                      alt={`${product.name} ${item}`}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>

              {/* Özellikler */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <feature.icon
                      className="mx-auto mb-2 text-indigo-600"
                      size={24}
                    />
                    <p className="font-semibold text-gray-900 text-sm">
                      {feature.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {feature.subtext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: Bilgiler */}
          <div className="xl:col-span-5">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                {/* Marka ve Başlık */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                    {product.brand}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-400"
                    />
                    <span className="text-sm font-bold text-gray-700 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Zap size={14} />
                    <span className="text-sm font-semibold">Çok Satan</span>
                  </div>
                </div>

                {/* Fiyat */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-4 mb-2">
                    <p className="text-4xl lg:text-5xl font-black text-indigo-700">
                      {product.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </p>
                    {product.old_price && (
                      <p className="text-xl text-gray-400 line-through">
                        {product.old_price.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </p>
                    )}
                  </div>
                </div>

                {/* Stok ve Butonlar */}
                <div className="space-y-4">
                  <div
                    className={`inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold mb-2 ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    <Check size={16} />
                    <span>{product.stock > 0 ? "Stokta Var" : "Tükendi"}</span>
                  </div>

                  {/* Sepete Ekle Butonu */}
                  <AddToCartButton product={product} />

                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 transition-all hover:scale-105">
                      Hemen Al
                    </button>
                    <button className="bg-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-600 transition-all hover:scale-105 flex items-center justify-center gap-2">
                      <Heart size={18} /> Favorile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Kısım: Açıklama */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ürün Açıklaması
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
