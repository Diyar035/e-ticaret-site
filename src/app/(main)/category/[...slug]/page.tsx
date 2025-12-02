import { prisma } from "@/lib/prisma-client";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // URL'den gelen ilk parametre (örn: "elektronik")
  const categorySlug = slug[0];

  // 1. Kategoriyi ve varsa alt kategorilerini (children) buluyoruz
  const currentCategory = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      children: true, // Alt kategorileri dahil et
    },
  });

  if (!currentCategory) {
    return notFound();
  }

  // 2. Aranacak ID Listesini oluşturuyoruz (Kapsayıcı Sorgu)
  // Hem kendi ID'si hem de altındaki çocukların ID'leri
  const categoryIdsToSearch = [
    currentCategory.id,
    ...currentCategory.children.map((child) => child.id),
  ];

  // 3. Ürünleri çekiyoruz (IN operatörü ile)
  const dbProducts = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIdsToSearch },
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true, // Ürünün kendi kategorisi
    },
  });

  // 4. Veriyi frontend formatına dönüştürme
  const sortedProducts = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image_url: (p.images && p.images[0]) || "https://via.placeholder.com/300",
    category_id: p.categoryId,
    is_featured: false,
    created_at: p.createdAt.toISOString(),
    rating: 5,
    brand: "Genel",
    stock: 10,
    old_price: p.price * 1.1,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- HEADER BÖLÜMÜ --- */}
      <div className="bg-white border-b p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb (Gezinme Yolu) */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Ana Sayfa
            </Link>
            <ChevronRight size={16} />
            <span className="text-blue-600 font-semibold">
              {currentCategory.name}
            </span>
          </nav>

          {/* Başlık ve Sayaç */}
          <h1 className="text-3xl font-bold text-slate-900">
            {currentCategory.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {sortedProducts.length} ürün listeleniyor
          </p>

          {/* Alt Kategori Filtreleri (Haplar) */}
          {currentCategory.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentCategory.children.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- ÜRÜN LİSTESİ BÖLÜMÜ --- */}
      <div className="max-w-7xl mx-auto p-6">
        {sortedProducts.length === 0 ? (
          // Ürün Yoksa Gösterilecek Kısım
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Bu Kategoride Ürün Yok
            </h2>
            <p className="text-gray-500 mb-6">
              Şu an için &quot;{currentCategory.name}&quot; ve alt kategorilerine ait
              ürün bulunmuyor.
            </p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 font-semibold hover:underline"
            >
              Admin Panelinden Ürün Ekle
            </Link>
          </div>
        ) : (
          // Ürün Varsa Listele
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}