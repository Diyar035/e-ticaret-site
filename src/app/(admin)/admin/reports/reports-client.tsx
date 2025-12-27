"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  ArrowLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";
import * as XLSX from "xlsx";

// Veri yapısını kesin olarak tanımlıyoruz (ESLint hatasını çözen kısım)
interface Order {
  id: string;
  customer: string;
  email: string;
  details: string;
  itemsCount?: number;
  date: string;
  amount: number | string;
}

interface ReportsClientProps {
  data: {
    revenue: number;
    deliveredCount: number;
    recentOrders: Order[]; // Satır 18: any[] yerine Order[] yapıldı
  };
}

export default function ReportsClient({ data }: ReportsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCustomer = searchParams.get("customer") || "";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === data.recentOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.recentOrders.map((o: Order) => o.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleExportExcel = () => {
    const toExport =
      selectedIds.length > 0
        ? data.recentOrders.filter((o: Order) => selectedIds.includes(o.id))
        : data.recentOrders;

    if (toExport.length === 0)
      return alert("Dışa aktarılacak veri bulunamadı.");

    const excelData = toExport.map((order: Order) => ({
      "Sipariş No": order.id,
      Müşteri: order.customer,
      "E-Posta": order.email,
      "Ürün Detayı": order.details,
      "Toplam Adet": order.itemsCount || 1,
      Tarih: order.date,
      "Tutar (TL)": Number(order.amount),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rapor");
    XLSX.writeFile(workbook, `KervanPazar_Rapor.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 text-left font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="p-3 hover:bg-gray-50 rounded-xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Raporlama Merkezi
            </h1>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">
              {selectedIds.length > 0
                ? `🔥 ${selectedIds.length} Sipariş Seçildi`
                : "Tüm kayıtlar listeleniyor"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Müşteri ara..."
              defaultValue={currentCustomer}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                updateFilter("customer", (e.target as HTMLInputElement).value)
              }
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-sm"
            />
          </div>

          <button
            onClick={handleExportExcel}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
              selectedIds.length > 0
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-[#00A76F] text-white"
            }`}
          >
            <Download size={18} />
            {selectedIds.length > 0 ? "SEÇİLİLERİ DIŞA AKTAR" : "EXCEL İNDİR"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
              <th className="py-6 px-6 text-center w-16">
                <button
                  onClick={toggleAll}
                  className="transition-colors hover:text-indigo-600"
                >
                  {selectedIds.length === data.recentOrders.length ? (
                    <CheckCircle2 size={22} className="text-indigo-600" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>
              </th>
              <th className="py-6 px-4">Müşteri Bilgisi</th>
              <th className="py-6 px-6">Ürün Detayı</th>
              <th className="py-6 px-6 text-center">Adet</th>
              <th className="py-6 px-6">Tarih</th>
              <th className="py-6 px-10 text-right">Toplam Tutar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* Satır 160: 'order: any' yerine 'order: Order' olarak güncellendi */}
            {data.recentOrders.map((order: Order) => (
              <tr
                key={order.id}
                className={`group transition-all ${
                  selectedIds.includes(order.id)
                    ? "bg-indigo-50/40"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <td className="py-6 px-6 text-center">
                  <button
                    onClick={() => toggleOne(order.id)}
                    className="transition-transform active:scale-125"
                  >
                    {selectedIds.includes(order.id) ? (
                      <CheckCircle2 size={22} className="text-indigo-600" />
                    ) : (
                      <Circle
                        size={22}
                        className="text-gray-200 group-hover:text-gray-300"
                      />
                    )}
                  </button>
                </td>
                <td className="py-6 px-4">
                  <div className="font-bold text-gray-900 leading-tight">
                    {order.customer}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono uppercase">
                    {order.email}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="text-xs text-gray-600 font-medium italic truncate max-w-[200px]">
                    {order.details}
                  </div>
                </td>
                <td className="py-6 px-6 text-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-black">
                    {order.itemsCount || 1} Adet
                  </span>
                </td>
                <td className="py-6 px-6 text-xs font-bold text-gray-400">
                  {order.date}
                </td>
                <td className="py-6 px-10 text-right font-black text-gray-900 text-sm">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(Number(order.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
