"use client";

import { User, Check, Mail, Phone, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Customer } from "./CustomersClient";
import { Dispatch, SetStateAction } from "react";

interface CustomersTableProps {
  data: Customer[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
}

export default function CustomersTable({
  data,
  selectedIds,
  setSelectedIds,
}: CustomersTableProps) {
  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length === data.length ? [] : data.map((c) => c.id)
    );
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden text-left">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[13px] uppercase tracking-[0.2em]">
            <th className="p-10 w-16 text-center">
              <div
                onClick={toggleAll}
                className={`w-7 h-7 rounded-xl border-2 cursor-pointer mx-auto flex items-center justify-center transition-all ${selectedIds.length === data.length && data.length > 0 ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white border-slate-200"}`}
              >
                {selectedIds.length === data.length && data.length > 0 && (
                  <Check size={16} className="text-white" />
                )}
              </div>
            </th>
            <th className="p-10">Müşteri Profili</th>
            <th className="p-10 text-center">İletişim</th>
            <th className="p-10 text-right">Kayıt Detayı</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            return (
              <tr
                key={user.id}
                className={`group transition-all duration-300 ${isSelected ? "bg-indigo-50/40" : "hover:bg-indigo-50/20"}`}
              >
                <td className="p-10 text-center">
                  <div
                    onClick={() => toggleOne(user.id)}
                    className={`w-7 h-7 rounded-xl border-2 cursor-pointer mx-auto flex items-center justify-center transition-all ${isSelected ? "bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-100" : "bg-white border-slate-200 group-hover:border-indigo-300"}`}
                  >
                    {isSelected && <Check size={16} className="text-white" />}
                  </div>
                </td>
                <td className="p-10">
                  <div className="flex items-center gap-7">
                    <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <User size={28} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 opacity-60">
                        ID: {user.id.substring(0, 16)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 rounded-2xl text-sm text-slate-600 font-bold border border-slate-100 group-hover:bg-white transition-colors">
                      <Mail size={16} className="text-slate-300" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-200">
                      <Phone size={16} /> {user.phone}
                    </div>
                  </div>
                </td>
                <td className="p-10 text-right">
                  <div className="inline-flex items-center gap-5">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-800 italic">
                        {format(new Date(user.createdAt), "dd MMMM yyyy", {
                          locale: tr,
                        })}
                      </div>
                      <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1.5 opacity-70">
                        SAAT: {format(new Date(user.createdAt), "HH:mm")}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={22} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
