<<<<<<< HEAD
"use client";

import { Search, Loader2, PackageX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useEffect } from "react";
import { useSearchStore } from "@/hooks/use-search-store";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // Zustand Store'dan state ve fonksiyonu çek
  const { products, isLoading, search } = useSearchStore();

  // URL'deki query değişince aramayı tetikle
  useEffect(() => {
    search(query);
  }, [query, search]); // query her değiştiğinde çalışır
=======
'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { mockProducts } from '@/lib/data/mock-data';

/**
 * Arama Sayfası Bileşeni
 * 
 * Kullanıcıların arama sorgularına göre filtrelenmiş ürünleri
 * gösterdiği sayfa. Ürün bulunamazsa boş durum gösterir.
 */
export default function SearchPage() {
  // URL'den arama parametrelerini al
  const searchParams = useSearchParams();
  // Query parametresini al veya boş string kullan
  const query = searchParams.get('query') || '';

  /**
   * Ürünleri arama sorgusuna göre filtrele
   * Ürün adında case-insensitive arama yapar
   */
  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
<<<<<<< HEAD
        {/* --- BAŞLIK ALANI --- */}
        <div className="mb-8">
          {query ? (
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">&quot;{query}&quot;</span> için
              arama sonuçları
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">Tüm Ürünler</h1>
          )}
        </div>

        {/* --- YÜKLENİYOR DURUMU --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-500">Ürünler aranıyor...</p>
          </div>
        ) : (
          <>
            {/* --- SONUÇLAR VEYA BOŞ DURUM --- */}
            {products.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Toplam {products.length} ürün bulundu.
                </p>
                {/* Store'dan gelen gerçek veriyi grid'e veriyoruz */}
                <ProductGrid products={products} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageX size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  <span className="font-semibold text-gray-900">"{query}"</span>{" "}
                  aramasıyla eşleşen bir ürün bulamadık. Yazım hatası yapmış
                  olabilir misiniz?
                </p>
              </div>
            )}
          </>
=======
        {/* ✅ Arama Sonuçları Başlığı - Sadece query varsa göster */}
        {query && (
          <h6 className="text-xl font-semibold text-gray-800 mb-6">
            {/* Vurgulanan arama terimi */}
            <span className="text-indigo-600">&quot;{query}&quot;</span>{' '}
            {' aramanızla eşleşen '}
            {/* Sonuç sayısı */}
            {filteredProducts.length} sonuç{' '}
            {/* Duruma göre farklı metin */}
            {filteredProducts.length === 0 ? 'bulundu.' : '   bulundu.'}
          </h6>
        )}

        {/* ✅ Ürün Grid veya Boş Durum */}
        {filteredProducts.length > 0 ? (
          // Ürünler bulunduysa grid göster
          <ProductGrid products={filteredProducts} />
        ) : (
          // Ürün bulunamadıysa boş durum göster
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            {/* Boş durum ikonu */}
            <Search size={48} className="mb-4 text-gray-400" />
            {/* Başlık */}
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ürün bulunamadı
            </h3>
            {/* Açıklama metni */}
            <p className="max-w-xs">
              Arama kriterlerinize uygun ürün bulunamadı. Lütfen başka bir ürün
              arayın veya filtreleri değiştirin.
            </p>
          </div>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
        )}
      </div>
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
