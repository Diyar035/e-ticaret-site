"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Archive, LayoutList, Filter, X } from "lucide-react"; // X ikonu eklendi
import { useDebouncedCallback } from "use-debounce";

export default function ProductToolbar({ totalCount }: { totalCount: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get("status") || "list";
  const activeFilter = searchParams.get("isActive");
  const searchQuery = searchParams.get("q");
  const currentSort = searchParams.get("sort");

  // Herhangi bir filtre aktif mi? (Varsayılanlar hariç)
  const hasActiveFilters =
    !!searchQuery ||
    !!activeFilter ||
    (currentSort && currentSort !== "createdAt_desc");

  // Parametre güncelleme yardımcısı
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams("q", term);
  }, 300);

  // 🔥 YENİ: Filtreleri Sıfırla
  const clearFilters = () => {
    const params = new URLSearchParams();
    // Sadece bulunduğumuz sekmeyi koru, gerisini sil
    if (currentStatus) params.set("status", currentStatus);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. SEKMELER */}
      <div className="flex justify-between items-end">
        <div className="bg-gray-100/50 p-1.5 rounded-2xl w-fit flex gap-1 border border-gray-200/60">
          <button
            onClick={() => updateParams("status", "list")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              currentStatus !== "archived"
                ? "bg-white text-gray-900 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <LayoutList
              size={18}
              className={currentStatus !== "archived" ? "text-indigo-600" : ""}
            />
            Ürün Listesi
          </button>

          <button
            onClick={() => updateParams("status", "archived")}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              currentStatus === "archived"
                ? "bg-white text-gray-900 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <Archive
              size={18}
              className={currentStatus === "archived" ? "text-amber-600" : ""}
            />
            Arşiv Kutusu
          </button>
        </div>

        {/* 🔥 YENİ: Filtreleri Temizle Butonu (Sadece filtre varsa görünür) */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors mb-1"
          >
            <X size={16} />
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* 2. FİLTRE VE ARAMA ALANI */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 bg-white p-1 rounded-2xl">
        {/* SOL: ARAMA */}
        <div className="relative w-full xl:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              className="text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
          </div>
          <input
            onChange={(e) => handleSearch(e.target.value)}
            // Arama kutusunu URL ile senkronize tutmak için value kullanıyoruz
            // key={searchQuery} ekleyerek resetlendiğinde inputun içini boşaltmasını sağlıyoruz
            key={searchQuery || "empty"}
            defaultValue={searchQuery || ""}
            placeholder="Ürün adı, ID veya Kategori ara..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          />
        </div>

        {/* SAĞ: FİLTRELER */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SATIŞ DURUMU FİLTRESİ */}
          {currentStatus !== "archived" && (
            <div className="relative">
              <select
                onChange={(e) => updateParams("isActive", e.target.value)}
                value={activeFilter || ""}
                className="pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 appearance-none min-w-[160px] shadow-sm transition-all"
              >
                <option value="">Tüm Durumlar</option>
                <option value="true">🟢 Satışta Olanlar</option>
                <option value="false">🔴 Satışa Kapalı</option>
              </select>
              <Filter
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          )}

          {/* SIRALAMA */}
          <div className="relative">
            <select
              onChange={(e) => updateParams("sort", e.target.value)}
              value={currentSort || "createdAt_desc"}
              className="pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 appearance-none min-w-[160px] shadow-sm transition-all"
            >
              <option value="createdAt_desc">En Yeni</option>
              <option value="price_asc">Fiyat (Artan)</option>
              <option value="price_desc">Fiyat (Azalan)</option>
              <option value="stock_asc">Stok (Azalan)</option>
              <option value="stock_desc">Stok (Artan)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col gap-0.5">
              <span className="w-2 h-1 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1 bg-gray-300 rounded-full mx-auto"></span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-2 hidden xl:block"></div>

          {/* SAYAÇ */}
          <div
            className={`flex items-center px-5 py-2.5 rounded-2xl text-sm font-black border whitespace-nowrap shadow-sm ${
              currentStatus === "archived"
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-indigo-50 text-indigo-700 border-indigo-100"
            }`}
          >
            {totalCount}{" "}
            <span className="ml-1.5 font-medium opacity-80">
              {currentStatus === "archived" ? "Arşivli" : "Ürün"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobilde Reset Butonu (Alt tarafta görünsün) */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="md:hidden flex w-full justify-center items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors"
        >
          <X size={16} />
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
