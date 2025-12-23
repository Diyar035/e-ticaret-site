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
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
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
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm outline-none font-medium text-gray-700"
            />
          </div>
        </div>

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
                  }`}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.id ? null : category.id
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
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Search size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Sonuç bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body // <-- İŞTE BURASI! Kod Header'da olsa bile body'ye çizilir.
  );
}
