"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Layers, GitFork } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function CategoryToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'den mevcut parametreleri al
  const searchQuery = searchParams.get("q");
  const typeFilter = searchParams.get("type"); // 'main' veya 'sub'

  // Herhangi bir filtre aktif mi?
  const hasActiveFilters = !!searchQuery || !!typeFilter;

  // Parametre güncelleme fonksiyonu
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams("q", term);
  }, 300);

  // Filtreleri Temizle
  const clearFilters = () => {
    router.replace("?");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
      {/* SOL: ARAMA */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            className="text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            size={20}
          />
        </div>
        <input
          onChange={(e) => handleSearch(e.target.value)}
          key={searchQuery || "empty"} // Resetlenince inputu boşaltır
          defaultValue={searchQuery || ""}
          placeholder="Kategori adı ara..."
          className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
        />
      </div>

      {/* SAĞ: FİLTRELER */}
      <div className="flex items-center gap-3">
        {/* TÜR FİLTRESİ (ANA / ALT) */}
        <div className="relative">
          <select
            onChange={(e) => updateParams("type", e.target.value)}
            value={typeFilter || ""}
            className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 appearance-none min-w-[160px] shadow-sm transition-all"
          >
            <option value="">Tüm Kategoriler</option>
            <option value="main">📌 Ana Kategoriler</option>
            <option value="sub">↳ Alt Kategoriler</option>
          </select>

          {/* İkon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {typeFilter === "main" ? (
              <Layers size={16} />
            ) : typeFilter === "sub" ? (
              <GitFork size={16} />
            ) : (
              <Filter size={16} />
            )}
          </div>
        </div>

        {/* FİLTRELERİ TEMİZLE BUTONU */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            <X size={16} />
            <span className="hidden md:inline">Temizle</span>
          </button>
        )}
      </div>
    </div>
  );
}
