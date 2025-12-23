"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import CustomersToolbar from "./CustomersToolbar";
import CustomersTable from "./CustomersTable";

// Bu interface sayesinde 'data' prop'unu kabul ediyoruz
interface CustomersClientProps {
  data: User[];
}

export default function CustomersClient({ data }: CustomersClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="space-y-6">
      <CustomersToolbar selectedIds={selectedIds} />
      <CustomersTable
        data={data}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium z-50 animate-in fade-in slide-in-from-bottom-4">
          {selectedIds.length} müşteri seçildi
        </div>
      )}
    </div>
  );
}
