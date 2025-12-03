import { prisma } from "@/lib/prisma-client";
import { ProductCard } from "@/components/product/ProductCard";
import CategoryMenu from "@/components/home/CategoryMenu";

export default async function HomePage() {
  // 1. Kategorileri Çek (Sol Menü)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { children: true } } },
    orderBy: { name: "asc" },
  });

  // 2. Ürünleri Çek (Sağ Taraf)
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { category: true }, // <-- Kategoriyi dahil ediyoruz ki ismini/slug'ını alalım
  });

  // 3. Veriyi ProductCard'ın anlayacağı dile çevir (Mapping)
  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image_url: p.images[0] || "https://via.placeholder.com/300",

    // --- BURASI SENİN DEDİĞİN KISIM ---
    // Slug ve İsim kategorinin içinde olduğu için oradan alıyoruz
    category_id: p.categoryId,
    category_title: p.category?.name || "Genel", // Kategori ismini gönderiyoruz
    category_slug: p.category?.slug || "#", // Kategori linki için slug'ı gönderiyoruz

    is_featured: false,
    created_at: p.createdAt.toISOString(),
    rating: 5,
    brand: "Genel",
    stock: 100,
    old_price: p.price * 1.2,
  }));

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol Menü */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <CategoryMenu />
        </aside>

        {/* Sağ Ürünler */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <h1 className="text-xl font-bold text-gray-800">Vitrin Ürünleri</h1>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10 bg-white border border-dashed rounded">
              <p className="text-gray-500">Henüz ürün yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                // Burada Type Hatası alırsan ProductCard tipini güncellemen gerekebilir
                // Ama şimdilik product prop'u içine ekstra bilgi gitmesinin zararı olmaz.
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
