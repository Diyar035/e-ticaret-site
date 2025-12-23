// src/components/order/OrderStatusUpdater.tsx

"use client";

import { useState, useTransition } from "react";
import { OrderStatus } from "@prisma/client";
import { Loader2, ChevronDown } from "lucide-react";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  // Sayfadan gelen güncelleme fonksiyonu
  updateAction: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

// 🔥 DÜZELTME: "PROCESSING" (Hazırlanıyor) veritabanında olmadığı için buradan silindi.
const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  {
    value: "PENDING",
    label: "Bekliyor",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "SHIPPED",
    label: "Kargolandı",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "DELIVERED",
    label: "Teslim Edildi",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "CANCELLED",
    label: "İptal Edildi",
    color: "bg-red-100 text-red-700",
  },
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  updateAction,
}: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    const oldStatus = status;
    setStatus(newStatus); // Arayüzü hemen güncelle

    startTransition(async () => {
      try {
        // Sayfadan gelen Server Action'ı çalıştır
        await updateAction(orderId, newStatus);
      } catch (error) {
        console.error("Hata:", error);
        setStatus(oldStatus); // Hata olursa geri al
        alert("Güncelleme başarısız!");
      }
    });
  };

  const activeColor =
    statusOptions.find((o) => o.value === status)?.color ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="relative group min-w-[140px]">
      <div className="relative">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          disabled={isPending}
          className={`
            appearance-none w-full pl-3 pr-8 py-2 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all
            focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${activeColor}
          `}
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-gray-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70">
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ChevronDown size={14} />
          )}
        </div>
      </div>
    </div>
  );
}
