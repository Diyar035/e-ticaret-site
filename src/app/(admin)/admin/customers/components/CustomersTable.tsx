"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";
import { Search, Mail, Calendar, Edit3 } from "lucide-react";

interface CustomersTableProps {
  data: User[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
}

export default function CustomersTable({
  data,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: CustomersTableProps) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
        <p className="text-gray-500 text-sm mt-1">
          Arama kriterlerinize uygun kayıt yok.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              {/* CHECKBOX SÜTUNU */}
              <th className="px-6 py-5 w-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                </div>
              </th>
              <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs">
                Müşteri
              </th>
              <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs">
                İletişim
              </th>
              <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((user) => {
              const isSelected = selectedIds.includes(user.id);
              return (
                <tr
                  key={user.id}
                  className={`transition-colors group ${isSelected ? "bg-indigo-50/60" : "hover:bg-gray-50/60"}`}
                >
                  {/* SATIR CHECKBOX */}
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectOne(user.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          user.image ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                        }
                        width={40}
                        height={40}
                        alt=""
                        className="rounded-xl shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar size={12} />
                          {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/customers/${user.id}`}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex transition-colors"
                    >
                      <Edit3 size={18} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
