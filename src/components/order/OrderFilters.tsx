"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function OrderFilters() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const currentSearch = searchParams.get("q") || "";

  // Arama Fonksiyonu
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Arama yapıldığında sayfa 1'e dönmek mantıklıdır ama şimdilik parametreleri koruyoruz
    replace(`?${params.toString()}`);
  }, 300);

  // Aramayı Temizle
  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    replace(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Sipariş No, Müşteri, Ürün Adı veya Ürün Kodu ile ara..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
        />
        {currentSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
