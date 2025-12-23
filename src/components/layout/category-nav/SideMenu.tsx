<<<<<<< HEAD
"use client";

import { ChevronRight, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // SİHİRLİ ANAHTAR BU!
import { Category } from "@prisma/client";

type CategoryWithChildren = Category & {
  children: Category[];
};

interface SideMenuProps {
  categories?: CategoryWithChildren[];
  isMenuOpen: boolean;
  onClose: () => void;
}

export function SideMenu({
  categories = [],
  isMenuOpen,
  onClose,
}: SideMenuProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // Sayfa yüklendi mi kontrolü

  // 1. ADIM: Portal için sayfanın yüklendiğinden emin oluyoruz
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Menü açılınca arkayı kilitle (Scroll Lock)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Arama filtresi
  const filteredCategories = categories.filter((category) => {
    const term = searchTerm.toLowerCase();
    const matchesCategory = category.name.toLowerCase().includes(term);
    const matchesChildren = category.children?.some((child) =>
      child.name.toLowerCase().includes(term)
    );
    return matchesCategory || matchesChildren;
  });

  // Eğer sayfa yüklenmediyse hiçbir şey gösterme (Hata almamak için)
  if (!mounted) return null;

  // 2. ADIM: createPortal ile menüyü document.body'ye (en dışa) ışınlıyoruz!
  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isMenuOpen ? "visible" : "invisible"
      }`}
    >
      {/* KARARTMA PERDESİ (Overlay) */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* MENÜ KUTUSU */}
      <div
        className={`absolute top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (Sabit Kısım) */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-md">
=======
'use client';

import { ChevronRight, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Category } from '@/types/index';

// Props interface'i - yan menü bileşeninin alacağı props'lar
interface SideMenuProps {
  categories: Category[]; // Kategori listesi
  isMenuOpen: boolean; // Menü açık/kapalı durumu
  onClose: () => void; // Menüyü kapatma fonksiyonu
}

/**
 * Yan Menü Bileşeni
 * 
 * Kategorileri gösteren slide-in yan menü.
 * Arama özelliği, kategori ve alt kategori navigasyonu içerir.
 * Mobil ve tablet kullanımı için optimize edilmiştir.
 */
export function SideMenu({ categories, isMenuOpen, onClose }: SideMenuProps) {
  // Arama terimi state'i
  const [searchTerm, setSearchTerm] = useState('');
  // Aktif kategori state'i - hangi kategorinin alt kategorileri açık
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Arama terimine göre kategorileri filtrele
  const filteredCategories = categories.filter(
    (category) =>
      // Kategori adında arama
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Alt kategori adlarında arama
      category.subCategories?.some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible delay-300'
      }`}
    >
      {/* ✅ Arkaplan Overlay - menü dışına tıklayarak kapatma */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

      {/* ✅ Yan Menü Container */}
      <div
        className={`relative z-10 h-full w-full max-w-md bg-gradient-to-b from-white to-gray-50/80 shadow-2xl transform transition-all duration-500 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Menü içine tıklamada kapanmayı engelle
      >
        {/* ✅ Başlık Bölümü */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Logo/Ikon */}
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
<<<<<<< HEAD
              <p className="text-xs text-gray-500 font-medium">
                {categories.length} Ana Kategori
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ARAMA (Sabit Kısım) */}
        <div className="p-4 border-b border-gray-50 bg-white flex-shrink-0">
=======
              <p className="text-sm text-gray-500">
                {categories.length} kategori
              </p>
            </div>
          </div>
          {/* Kapatma Butonu */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            aria-label="Menüyü kapat"
          >
            <X size={20} className="text-gray-600 group-hover:text-gray-900" />
          </button>
        </div>

        {/* ✅ Arama Çubuğu */}
        <div className="p-4 border-b border-gray-100 bg-white/50">
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm outline-none font-medium text-gray-700"
=======
              className="w-full pl-10 pr-4 py-3 bg-gray-100/80 border border-transparent rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
            />
          </div>
        </div>

<<<<<<< HEAD
        {/* LİSTE (Kaydırılabilir Kısım) */}
        <div className="flex-1 overflow-y-auto bg-white p-3 custom-scrollbar">
          <div className="space-y-1 pb-24">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="group rounded-xl overflow-hidden"
              >
                <div
                  className={`flex items-center justify-between p-3.5 cursor-pointer transition-all rounded-xl ${
                    activeCategory === category.id
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "bg-transparent hover:bg-gray-50 text-gray-700"
=======
        {/* ✅ Kategori Listesi - Scroll edilebilir alan */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
          <div className="p-4 space-y-2">
            {/* Filtrelenmiş kategorileri listele */}
            {filteredCategories.map((category) => (
              <div key={category.id} className="group">
                {/* Ana Kategori */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-indigo-50 border border-indigo-200 shadow-sm' // Aktif kategori stili
                      : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200' // Normal stil
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                  }`}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.id ? null : category.id
<<<<<<< HEAD
                    )
                  }
                >
                  <span className="font-semibold text-sm">{category.name}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-200 text-gray-400 ${
                        activeCategory === category.id
                          ? "rotate-90 text-indigo-500"
                          : ""
                      }`}
                    />
                  )}
                </div>

                {/* Alt Kategoriler */}
                {activeCategory === category.id && category.children && (
                  <div className="ml-4 pl-4 border-l-2 border-indigo-100 my-1 space-y-1">
                    {category.children.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.slug}`}
                        className="block px-3 py-2.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                        onClick={onClose}
                      >
                        {sub.name}
=======
                    ) // Tıklamada aç/kapat
                  }
                >
                  <div className="flex items-center gap-3">
                    {/* Kategori indikatör noktası */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-indigo-600 scale-150' // Aktif kategori
                          : 'bg-gray-300 group-hover:bg-indigo-400' // Normal durum
                      }`}
                    />
                    <span
                      className={`font-semibold transition-colors ${
                        activeCategory === category.id
                          ? 'text-indigo-700' // Aktif kategori rengi
                          : 'text-gray-700 group-hover:text-gray-900' // Normal renk
                      }`}
                    >
                      {category.name}
                    </span>
                    {/* Alt kategori sayısı */}
                    {category.subCategories && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {category.subCategories.length}
                      </span>
                    )}
                  </div>
                  {/* Açılır ok ikonu */}
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${
                      activeCategory === category.id
                        ? 'rotate-90 text-indigo-600' // Aktif kategori ok
                        : 'group-hover:text-gray-600' // Normal ok
                    }`}
                  />
                </div>

                {/* Alt Kategoriler - sadece aktif kategoride göster */}
                {activeCategory === category.id && category.subCategories && (
                  <div className="ml-6 mt-2 space-y-1 animate-fadeIn">
                    {category.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${category.id}/${sub.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group/sub"
                        onClick={onClose} // Tıklamada menüyü kapat
                      >
                        {/* Alt kategori indikatör noktası */}
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/sub:bg-indigo-400 transition-colors" />
                        <span className="text-sm">{sub.name}</span>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

<<<<<<< HEAD
            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Search size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Sonuç bulunamadı</p>
=======
            {/* ✅ Boş Durum - arama sonucu yoksa */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Kategori bulunamadı</p>
                <p className="text-gray-400 text-sm mt-1">
                  Arama teriminizi değiştirmeyi deneyin
                </p>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
              </div>
            )}
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </div>,
    document.body // <-- İŞTE BURASI! Kod Header'da olsa bile body'ye çizilir.
  );
}
=======
    </div>
  );
}
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
