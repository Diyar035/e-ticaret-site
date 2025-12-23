import { prisma } from "@/lib/prisma-client";
<<<<<<< HEAD
import ProductCard from "@/components/product/ProductCard";
import {
  ChevronRight,
  Home,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string[];
  };
  searchParams: {
    sort?: string;
  };
}

export const revalidate = 0;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const rawSlug = params.slug[params.slug.length - 1];
  const slug = decodeURIComponent(rawSlug);

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return {
    title: category ? `${category.name} | KervanPazar` : "Kategori Bulunamadı",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const rawSlug = params.slug[params.slug.length - 1];
  const categorySlug = decodeURIComponent(rawSlug);

  // 1. Kategori ve Altları
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // 2. ID Listesi Oluşturma (Recursive mantık)
  const allCategoryIds = [category.id];
  if (category.children) {
    category.children.forEach((child) => {
      allCategoryIds.push(child.id);
      if (child.children) {
        child.children.forEach((grandChild) => {
          allCategoryIds.push(grandChild.id);
        });
      }
    });
  }

  // 3. Sıralama
  const sortParam = searchParams.sort;
  let orderBy: any = { createdAt: "desc" };

  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };
  if (sortParam === "name_asc") orderBy = { name: "asc" };

  // 4. Ürünleri Çek
  const rawProducts = await prisma.product.findMany({
    where: {
      categoryId: { in: allCategoryIds },
      isActive: true,
      isArchived: false,
    },
    include: {
      images: true,
    },
    orderBy: orderBy,
  });

  // 5. Veri Dönüşümü
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    stock: p.stock,
    images: p.images.map((img) => ({
      url: img.url,
      isMain: img.isMain,
    })),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* --- MİNİMAL HEADER --- */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
            <Link
              href="/"
              className="hover:text-[#667EEA] transition-colors flex items-center gap-1"
            >
              <Home size={12} /> Ana Sayfa
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{category.name}</span>
          </div>

          {/* Başlık */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Toplam{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                ürün listeleniyor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SOL TARA: FİLTRELER (Sadeleştirildi) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Alt Kategoriler */}
              {category.children && category.children.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Kategoriler
                  </h3>
                  <ul className="space-y-2.5">
                    {category.children.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${sub.slug}`}
                          className="text-sm text-gray-600 hover:text-[#667EEA] hover:pl-1 transition-all flex items-center justify-between group"
                        >
                          {sub.name}
                          <ChevronRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#667EEA]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fiyat Filtresi (Minimal) */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                  Fiyat Aralığı
                </h3>
                <div className="space-y-3">
                  {["0 ₺ - 500 ₺", "500 ₺ - 1000 ₺", "1000 ₺ ve üzeri"].map(
                    (label, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer w-4 h-4 border-2 border-gray-300 rounded checked:border-[#667EEA] checked:bg-[#667EEA] transition-all appearance-none cursor-pointer"
                          />
                          <CheckIcon className="absolute left-0.5 top-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          {label}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* SAĞ TARAF: ÜRÜN LİSTESİ */}
          <div className="flex-1">
            {/* Sıralama Barı (Clean) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter size={16} />
                <span className="hidden sm:inline">Listeleme seçenekleri</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wide">
                  Sırala:
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`?sort=price_asc`}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${sortParam === "price_asc" ? "border-[#667EEA] text-[#667EEA] bg-indigo-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Artan Fiyat
                  </Link>
                  <Link
                    href={`?sort=price_desc`}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${sortParam === "price_desc" ? "border-[#667EEA] text-[#667EEA] bg-indigo-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Azalan Fiyat
                  </Link>
                </div>
              </div>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <PackageIcon className="text-gray-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Ürün Bulunamadı
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  Bu kriterlere uygun ürünümüz şu an stoklarımızda yok.
                </p>
                <Link
                  href="/"
                  className="mt-6 text-[#667EEA] font-medium hover:underline text-sm"
                >
                  Tüm Ürünleri Gör
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Icons
function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 5.35" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.29 7 12 12.03 20.71 7" />
      <path d="M12 22.03V12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
=======
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
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
