"use client";

import { Archive } from "lucide-react"; // İkon (Yoksa "Arşivle" yaz)
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArchiveProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleArchive = async () => {
    // Uyarı mesajını değiştirdik
    if (!confirm("Bu ürünü arşive göndermek istediğinize emin misiniz?")) return;

    setLoading(true);

    try {
      // DELETE yerine PATCH atıyoruz ve isActive: false diyoruz
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: false }), 
      });

      if (res.ok) {
        router.refresh();
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
      onClick={handleArchive}
      disabled={loading}
      className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition"
      title="Arşive Gönder"
    >
      {loading ? "..." : <Archive size={20} />} 
    </button>
  );
}