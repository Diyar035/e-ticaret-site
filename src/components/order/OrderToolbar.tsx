// src/components/admin/OrderToolbar.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Search,
  Calendar,
  RefreshCcw,
  X,
  Filter,
  ChevronDown,
  Trash2,
} from "lucide-react";

interface OrderToolbarProps {
  availableYears?: number[];
}

export default function OrderToolbar({
  availableYears = [],
}: OrderToolbarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const year = searchParams.get("year") || "";
  const month = searchParams.get("month") || "";
  const exactDate = searchParams.get("exactDate") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const handleSearch = (term: string, type: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set(type, term);
    } else {
      params.delete(type);
    }

    if (type === "year" || type === "month") {
      params.delete("exactDate");
      params.delete("startDate");
      params.delete("endDate");
    }
    if (type === "exactDate" || type === "startDate" || type === "endDate") {
      params.delete("year");
      params.delete("month");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleTextSearch = useDebouncedCallback((term: string) => {
    handleSearch(term, "q");
  }, 300);

  const clearFilters = () => {
    replace(pathname);
    setShowFilters(false);
  };

  const months = [
    { value: "1", label: "Ocak" },
    { value: "2", label: "Şubat" },
    { value: "3", label: "Mart" },
    { value: "4", label: "Nisan" },
    { value: "5", label: "Mayıs" },
    { value: "6", label: "Haziran" },
    { value: "7", label: "Temmuz" },
    { value: "8", label: "Ağustos" },
    { value: "9", label: "Eylül" },
    { value: "10", label: "Ekim" },
    { value: "11", label: "Kasım" },
    { value: "12", label: "Aralık" },
  ];

  const hasActiveFilters =
    status || exactDate || startDate || endDate || year || month || q;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
      {/* --- ÜST SATIR --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Arama */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          {/* 👇 GÜNCELLEME: Placeholder'a 'Ürün ID' ibaresi eklendi */}
          <input
            type="text"
            placeholder="Sipariş No, Müşteri, Ürün Adı veya Ürün ID Ara..."
            defaultValue={q}
            onChange={(e) => handleTextSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Yıl ve Ay */}
        <div className="flex gap-2">
          <select
            value={year}
            onChange={(e) => handleSearch(e.target.value, "year")}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Yıl</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => handleSearch(e.target.value, "month")}
            disabled={!year}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
          >
            <option value="">Ay</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Buton Grubu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border whitespace-nowrap
              ${
                showFilters
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <Filter size={18} />
            Filtrele
            {hasActiveFilters && !showFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 ml-1 animate-pulse" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100 font-medium text-sm whitespace-nowrap"
            >
              <Trash2 size={18} />
              Sıfırla
            </button>
          )}
        </div>
      </div>

      {/* --- ALT SATIR (GİZLİ BÖLÜM) --- */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tam Tarih */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 ml-1">
                Tam Tarih
              </span>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
                <input
                  type="date"
                  defaultValue={exactDate}
                  onChange={(e) => handleSearch(e.target.value, "exactDate")}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Başlangıç */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 ml-1">
                Başlangıç Tarihi
              </span>
              <input
                type="date"
                defaultValue={startDate}
                onChange={(e) => handleSearch(e.target.value, "startDate")}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            {/* Bitiş */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 ml-1">
                Bitiş Tarihi
              </span>
              <input
                type="date"
                defaultValue={endDate}
                onChange={(e) => handleSearch(e.target.value, "endDate")}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            {/* Durum */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 ml-1">
                Sipariş Durumu
              </span>
              <div className="relative">
                <RefreshCcw
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"
                  size={16}
                />
                <select
                  defaultValue={status}
                  onChange={(e) => handleSearch(e.target.value, "status")}
                  className="w-full pl-9 pr-8 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-700 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="PENDING">Bekleyen</option>
                  <option value="PROCESSING">Hazırlanıyor</option>
                  <option value="SHIPPED">Kargolandı</option>
                  <option value="DELIVERED">Teslim Edildi</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* Sıfırlama Butonu (Altta) */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-4 pt-4 border-t border-dashed border-gray-100">
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 font-medium"
              >
                <X size={14} /> Tüm Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
