import { prisma } from "@/lib/prisma-client";
import CategoryDataTable from "@/app/(admin)/admin/categories/CategoryDataTable";
import Link from "next/link";
import { Plus, Layers, Grid, ListTree, SearchX } from "lucide-react"; // Yeni ikonlar
import CategoryToolbar from "@/app/(admin)/admin/categories/CategoryToolbar";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string; // 'main' veya 'sub'
  }>;
}

export default async function AdminCategoriesPage(
  props: AdminCategoriesPageProps
) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const typeParam = searchParams.type;

  // --- FİLTRELEME MANTIĞI ---
  const where: Prisma.CategoryWhereInput = {
    AND: [
      query ? { name: { contains: query, mode: "insensitive" } } : {},
      typeParam === "main"
        ? { parentId: null }
        : typeParam === "sub"
          ? { parentId: { not: null } }
          : {},
    ],
  };

  // --- VERİYİ ÇEK ---
  const categories = await prisma.category.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      parent: true,
      attributes: true,
      _count: {
        select: { products: true },
      },
      brands: true,
    },
  });

  // --- BASİT İSTATİSTİKLER (Client tarafında hesaplamak yerine burada hızlıca bakıyoruz) ---
  const totalCount = categories.length;
  const mainCount = categories.filter((c) => !c.parentId).length;
  const subCount = categories.filter((c) => c.parentId).length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- ÜST HEADER VE İSTATİSTİKLER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Başlık */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <Layers className="text-indigo-600" size={32} />
                Kategori Yönetimi
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">
                Mağaza hiyerarşisi ve filtreleme özelliklerini yapılandırın.
              </p>
            </div>

            {/* Aksiyon Butonu */}
            <Link
              href="/admin/categories/new"
              className="group flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 font-semibold"
            >
              <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                <Plus size={16} />
              </div>
              Yeni Kategori Oluştur
            </Link>
          </div>

          {/* Hızlı İstatistik Kartları (Mobil uyumlu grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              label="Görüntülenen"
              value={totalCount}
              icon={<Layers size={18} />}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              label="Ana Kategori"
              value={mainCount}
              icon={<Grid size={18} />}
              color="text-purple-600"
              bg="bg-purple-50"
            />
            <StatCard
              label="Alt Kategori"
              value={subCount}
              icon={<ListTree size={18} />}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            {/* Buraya istenirse Toplam Ürün Sayısı gibi başka bir stat da eklenebilir */}
          </div>
        </div>
      </div>

      {/* --- ANA İÇERİK --- */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 space-y-6">
        {/* Toolbar (Arama & Filtre) */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <CategoryToolbar />
        </div>

        {/* Tablo Alanı veya Empty State */}
        {categories.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ring-1 ring-gray-950/5">
            <CategoryDataTable categories={categories} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <SearchX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sonuç Bulunamadı
            </h3>
            <p className="text-gray-500 max-w-sm text-center mt-2">
              &quot;{query}&quot; araması için veya seçilen filtrede herhangi
              bir kategori bulunamadı. bulunamadı.
            </p>
            {query && (
              <Link
                href="/admin/categories"
                className="mt-4 text-indigo-600 hover:underline font-medium"
              >
                Filtreleri Temizle
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Yardımcı Bileşen: İstatistik Kartı ---
function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${bg} ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
