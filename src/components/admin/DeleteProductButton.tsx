"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // Son uyarı!
    if (
      !confirm(
        "DİKKAT! Bu ürün tamamen silinecek ve geri getirilemeyecek. Emin misiniz?"
      )
    )
      return;

    setLoading(true);

    try {
      // API'ye DELETE isteği atıyoruz
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Silinemedi.");
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
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
      title="Kalıcı Olarak Sil"
    >
      {loading ? "..." : <Trash2 size={20} />}
    </button>
  );
}
