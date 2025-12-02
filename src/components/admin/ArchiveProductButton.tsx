"use client";

import { Archive } from "lucide-react"; // Eğer lucide-react yoksa, buraya "Arşiv" yazabilirsin icon yerine
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArchiveProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleArchive = async () => {
    if (!confirm("Bu ürünü arşive göndermek istediğinize emin misiniz?"))
      return;

    setLoading(true);

    try {
      // API'ye PATCH isteği atıp isActive: false yapıyoruz
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (res.ok) {
        router.refresh(); // Listeyi yenile ki ürün kaybolsun
      } else {
        alert("İşlem başarısız.");
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
