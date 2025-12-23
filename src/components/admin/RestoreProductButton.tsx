"use client";

import { RefreshCcw } from "lucide-react"; // İkon (Yoksa "Geri Al" yaz)
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestoreProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    setLoading(true);

    try {
      // API'ye PATCH atıyoruz ve isActive: true yapıyoruz (Ürünü canlandırıyoruz)
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });

      if (res.ok) {
        router.refresh(); // Listeden kaybolup ana sayfaya dönecek
      } else {
        alert("Geri yüklenemedi!");
      }
    } catch (error) {
      console.error(error);
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition"
      title="Geri Yükle / Yayına Al"
    >
      {loading ? "..." : <RefreshCcw size={20} />}
    </button>
  );
}
