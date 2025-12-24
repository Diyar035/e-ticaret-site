"use client";

import { Search, FileSpreadsheet, Trash2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { Customer } from "./CustomersClient";
import { Dispatch, SetStateAction } from "react";

// Props tanımını tam hale getirdik
interface CustomersToolbarProps {
  data: Customer[];
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedIds: string[];
  onClear: () => void;
}

export default function CustomersToolbar({
  data,
  searchTerm,
  setSearchTerm,
  selectedIds,
  onClear,
}: CustomersToolbarProps) {
  const downloadExcel = () => {
    const exportList =
      selectedIds.length > 0
        ? data.filter((c) => selectedIds.includes(c.id))
        : data;

    const worksheet = XLSX.utils.json_to_sheet(
      exportList.map((u) => ({
        Müşteri: u.name,
        "E-Posta": u.email,
        Telefon: u.phone,
        Kayıt: u.createdAt,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Müşteriler");
    XLSX.writeFile(workbook, "Musteri_Portfoyu.xlsx");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Müşteri Portföyü
          </h1>
          <p className="text-slate-500 font-medium mt-4 italic flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Sistemde listelenen {data.length} aktif kayıt bulundu.
          </p>
        </div>
        <button
          onClick={downloadExcel}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-2xl transition-all active:scale-95 group"
        >
          <FileSpreadsheet size={22} />
          {selectedIds.length > 0 ? "SEÇİLİLERİ AKTAR" : "EXCEL'E AKTAR"}
        </button>
      </div>

      <div className="relative group text-left">
        <Search
          className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
          size={28}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İsim, e-posta veya telefon ile akıllı ara..."
          className="w-full pl-20 pr-12 py-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[3rem] text-xl font-medium outline-none border-2 border-transparent focus:border-indigo-100 transition-all placeholder:text-slate-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-12 border border-white/10 backdrop-blur-xl">
          <span className="font-black border-r border-white/20 pr-8 tracking-tighter italic uppercase text-lg text-indigo-400">
            {selectedIds.length} Kayıt Seçildi
          </span>
          <button className="flex items-center gap-2 hover:text-red-400 transition-colors font-bold text-sm uppercase">
            {" "}
            <Trash2 size={20} /> SEÇİLENLERİ SİL{" "}
          </button>
          <button
            onClick={onClear}
            className="text-white/40 hover:text-white transition-all font-bold text-sm uppercase"
          >
            {" "}
            VAZGEÇ{" "}
          </button>
        </div>
      )}
    </div>
  );
}
