import { getSidebarStats } from "@/lib/actions/sidebar-actions";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

/**
 * @description Admin Paneli Ana Düzeni
 * @note TSX formatında yazılmıştır, div ve component etiketleri içerir.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Veritabanından istatistikleri çek (Server-Side)
  const stats = await getSidebarStats();

  return (
    <AdminLayoutClient stats={stats}>
      <div className="min-h-screen bg-white">{children}</div>
    </AdminLayoutClient>
  );
}
