"use client";

import { useState } from "react";
import CustomersToolbar from "./CustomersToolbar";
import CustomersTable from "./CustomersTable";

// Proje genelinde kullanılacak temiz Müşteri Tipi
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function CustomersClient({ data = [] }: { data: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtreleme (İsim, Mail veya Telefon)
  const filtered = data.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 pb-40">
      <div className="max-w-7xl mx-auto space-y-10">
        <CustomersToolbar
          data={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
        />
        <CustomersTable
          data={filtered}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>
    </div>
  );
}
