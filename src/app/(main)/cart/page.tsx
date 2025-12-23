<<<<<<< HEAD
"use client";

import useCart from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
=======
'use client';
// Client Component: Bu dosya bir istemci bileşenidir ve tarayıcıda çalışır
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
import {
  Lock,
  Minus,
  Plus,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
<<<<<<< HEAD
  Loader2,
  Ban,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    removeAll,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const isAdmin = session?.user?.role === "ADMIN";

  // 🟢 GÜNCELLENDİ: ARTIK SİPARİŞ OLUŞTURMUYOR, YÖNLENDİRİYOR
  const handleCheckout = () => {
    // 1. Giriş Kontrolü
    if (!session) {
      toast.error("Ödeme adımına geçmek için giriş yapmalısınız.");
      // Giriş yaptıktan sonra direkt checkout'a atsın diye callbackUrl veriyoruz
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    // 2. Admin Kontrolü
    if (isAdmin) {
      toast.error("Yöneticiler alışveriş yapamaz!");
      return;
    }

    setIsLoading(true);

    // 3. Checkout Sayfasına Yönlendir
    // (Veriler zaten useCart hook'unda kayıtlı olduğu için prop taşımaya gerek yok)
    router.push("/checkout");
  };

  // --- BOŞ SEPET GÖRÜNÜMÜ ---
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 animate-pulse-slow">
          <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
            <ShoppingCart
              size={80}
              strokeWidth={1.5}
              className="text-[#764BA2]"
            />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sepetiniz Henüz Boş
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          İhtiyacınız olan ürünleri keşfetmek için mağazamıza göz atın.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-2xl hover:shadow-lg hover:shadow-[#667EEA]/40 hover:-translate-y-1"
        >
          <span>Alışverişe Başla</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
=======
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart'; // Sepet durumu için özel hook

export default function CartPage() {
  // Sepet context'inden gerekli fonksiyonları ve durumları al
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Sepet boşsa boş sepet görünümünü göster
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 text-center">
        {/* Boş sepet ikonu */}
        <div className="text-8xl mb-6">
          <ShoppingCart />
        </div>
        {/* Başlık */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
          Sepetiniz Boş
        </h1>
        {/* Açıklama metni */}
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın ve harika
          ürünleri keşfedin!
        </p>
        {/* Ana sayfaya dönüş butonu */}
        <Link
          href="/"
          className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg"
        >
          Alışverişe Başla
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
        </Link>
      </div>
    );
  }

<<<<<<< HEAD
  // --- DOLU SEPET GÖRÜNÜMÜ ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlık Alanı */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Alışveriş Sepeti
            </h1>
            <p className="text-gray-500 font-medium">
              <span className="text-[#764BA2] font-bold">
                {totalItems} ürün
              </span>{" "}
              sepetinizde bekliyor.
            </p>
          </div>
          <button
            onClick={removeAll}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Sepeti Temizle
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
          {/* --- SOL: ÜRÜN LİSTESİ (8 Kolon) --- */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:border-[#667EEA]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-6">
                  {/* Görsel */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart size={32} />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#667EEA] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      {/* Miktar Arttır/Azalt */}
                      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) removeItem(item.id);
                            else updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#764BA2] transition-colors"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#667EEA] transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Fiyat */}
                      <div className="text-right">
                        <div className="text-sm text-gray-400 font-medium">
                          Toplam
                        </div>
                        <div className="text-xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                          {(Number(item.price) * item.quantity).toLocaleString(
                            "tr-TR",
                            { minimumFractionDigits: 2 }
                          )}{" "}
                          ₺
                        </div>
                      </div>
                    </div>
                  </div>
=======
  // Sepet doluysa ana sepet görünümünü göster
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Sayfa Başlığı */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-2">
            Alışveriş Sepeti
          </h1>
          {/* Sepet özeti: toplam ürün sayısı ve toplam fiyat */}
          <p className="text-gray-600 text-lg">
            {totalItems} ürün • Toplam:{' '}
            {totalPrice.toLocaleString('tr-TR', {
              // style: 'currency' yerine 'decimal' kullanıyoruz
              style: 'decimal',
              // Kuruşları (ondalık kısmı) her zaman göstermek için bu ayarları ekliyoruz
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            ₺
          </p>
        </div>

        {/* Grid layout: Ürün listesi ve özet paneli */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ürün Listesi - 2/3 genişlik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sepetteki her ürün için kart oluştur */}
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Ürün Görseli */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <Link href={`/urun/${product.id}`}>
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </Link>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 min-w-0">
                    {/* Ürün adı - tıklanabilir */}
                    <Link href={`/urun/${product.id}`}>
                      <h2 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Ürün fiyatı */}
                    <p className="text-xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
                      {product.price.toLocaleString('tr-TR', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </p>

                    {/* Miktar kontrol butonları */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                        {/* Azalt butonu - miktar 1 ise ürünü sepetten kaldır */}
                        <button
                          onClick={() => {
                            if (quantity === 1) {
                              removeFromCart(product.id);
                            } else {
                              updateQuantity(product.id, quantity - 1);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-gray-600 font-bold"
                        >
                          <Minus />
                        </button>
                        {/* Mevcut miktar */}
                        <span className="min-w-[2ch] text-center font-semibold text-gray-800">
                          {quantity}
                        </span>
                        {/* Artır butonu */}
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-gray-600 font-bold"
                        >
                          <Plus />
                        </button>
                      </div>

                      {/* Ara toplam: birim fiyat × miktar */}
                      <div className="text-sm text-gray-600">
                        Ara toplam: <br />
                        <span className="font-semibold text-gray-800">
                          {(product.price * quantity).toLocaleString('tr-TR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ürünü sepetten kaldır butonu */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 self-start sm:self-center"
                  >
                    <span className="text-lg">
                      <Trash2 />
                    </span>
                    Kaldır
                  </button>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                </div>
              </div>
            ))}
          </div>

<<<<<<< HEAD
          {/* --- SAĞ: ÖZET PANELİ (4 Kolon) --- */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Ara Toplam</span>
                  <span>
                    {totalPrice.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Kargo</span>
                  <span className="text-green-600 font-bold">Ücretsiz</span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">
                    Genel Toplam
                  </span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-gray-900">
                      {totalPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      KDV Dahil
=======
          {/* Sepet Özet Paneli - 1/3 genişlik */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Sipariş Özeti
              </h2>

              {/* Sipariş detayları */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Toplam Ürün:</span>
                  <span className="font-semibold text-gray-800">
                    {totalItems} adet
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-semibold text-green-600">ÜCRETSİZ</span>
                </div>
                {/* Genel toplam bölümü */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">
                      Genel Toplam:
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                      {totalPrice.toLocaleString('tr-TR', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ₺
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                    </span>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              {/* BUTON / UYARI ALANI */}
              {isAdmin ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center space-y-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm mx-auto">
                    <Ban size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-red-900 font-bold text-sm">
                    İşlem Kısıtlandı
                  </h3>
                  <p className="text-red-600 text-xs leading-relaxed">
                    Yönetici hesapları sipariş oluşturamaz. Lütfen müşteri
                    hesabıyla giriş yapın.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#667EEA]/30 hover:shadow-[#667EEA]/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" />
                      Yönlendiriliyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Ödemeye Geç
                      <Truck className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                  {/* Buton içi parıltı efekti */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                </button>
              )}

              {/* Güven Rozetleri */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex gap-4 text-gray-300">
                  <Shield size={24} />
                  <Lock size={24} />
                </div>
                <p className="text-xs text-gray-400 font-medium text-center">
                  256-Bit SSL Sertifikası ile
                  <br />
                  %100 Güvenli Ödeme
=======
              {/* Aksiyon butonları */}
              <div className="space-y-3">
                {/* Ödemeye geç butonu */}
                <button className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg">
                  Güvenli Ödemeye Geç
                </button>
                {/* Sepeti temizle butonu */}
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <span>
                    <Trash2 />
                  </span>
                  Sepeti Temizle
                </button>
              </div>

              {/* Güven sembolleri */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-4 text-2xl">
                  <span title="Güvenli Ödeme">
                    <Lock />
                  </span>
                  <span title="SSL Sertifikası">
                    <Shield />
                  </span>
                  <span title="Hızlı Teslimat">
                    <Truck />
                  </span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  %100 Güvenli Alışveriş
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
