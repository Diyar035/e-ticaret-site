"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  sortKey: string; // 'price', 'stock', 'name' gibi
}

export default function SortableHeader({
  label,
  sortKey,
}: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mevcut sıralama bilgisini al
  const currentSort = searchParams.get("sort") || "";

  // Şu an bu sütuna göre mi sıralı?
  const isActive = currentSort.startsWith(sortKey);
  const direction = isActive && currentSort.endsWith("_desc") ? "desc" : "asc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Mantık: Tıklayınca tersine çevir
    if (isActive && direction === "asc") {
      params.set("sort", `${sortKey}_desc`);
    } else {
      params.set("sort", `${sortKey}_asc`);
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <th
      onClick={handleSort}
      className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-50 transition-colors select-none"
    >
      <div className="flex items-center gap-2">
        {label}
        <span
          className={`transition-all ${isActive ? "text-indigo-600" : "text-gray-300 group-hover:text-gray-400"}`}
        >
          {isActive ? (
            direction === "asc" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )
          ) : (
            <ArrowUpDown size={14} />
          )}
        </span>
      </div>
    </th>
  );
}
