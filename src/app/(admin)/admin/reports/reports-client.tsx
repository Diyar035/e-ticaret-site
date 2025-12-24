"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, ArrowLeft, Mail, Phone } from "lucide-react";
import * as XLSX from "xlsx";

interface Order {
  id: string;
  customer: string;
  email: string | null;
  phone: string;
  details: string;
  date: string;
  amount: number;
}

interface ReportsClientProps {
  data: {
    revenue: number;
    recentOrders: Order[];
  };
}

export default function ReportsClient({ data }: ReportsClientProps) {
  const router = useRouter();

  // Telefon bilgisini kontrol eden yardımcı fonksiyon
  const formatPhone = (phone: string) => {
    if (
      !phone ||
      phone === "Bilinmiyor" ||
      phone === "Tanımsız" ||
      phone.trim() === ""
    ) {
      return "-";
    }
    return phone;
  };

  const downloadExcel = () => {
    const excelData = data.recentOrders.map((order) => ({
      Müşteri: order.customer,
      "E-Posta": order.email || "N/A",
      // Excel dökümünde tel yoksa "-" koyar
      Telefon: formatPhone(order.phone),
      "Ürün Detayı": order.details,
      Tarih: order.date,
      Tutar: `${order.amount} TL`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SatisRaporu");
    XLSX.writeFile(workbook, "Detayli_Satis_Raporu.xlsx");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-left">
      <div className="mb-10 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white rounded-xl border shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={downloadExcel}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 hover:bg-emerald-700 transition-all"
        >
          <FileSpreadsheet size={20} /> DETAYLI EXCEL İNDİR
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase italic">
              <th className="p-8">Müşteri & İletişim</th>
              <th className="p-8">Ürün</th>
              <th className="p-8">Tarih</th>
              <th className="p-8 text-right">Tutar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/50 transition-all"
              >
                <td className="p-8">
                  <div className="font-bold text-slate-900">
                    {order.customer}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <Mail size={12} className="text-slate-300" />{" "}
                    {order.email || "N/A"}
                    <Phone size={12} className="ml-2 text-slate-300" />
                    {/* Tabloda tel yoksa "-" koyar */}
                    <span className="font-medium">
                      {formatPhone(order.phone)}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-xs italic text-slate-500">
                  {order.details}
                </td>
                <td className="p-8 text-xs font-bold text-slate-400">
                  {order.date}
                </td>
                <td className="p-8 font-black text-slate-900 text-right">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(order.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
