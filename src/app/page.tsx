import { prisma } from "@/lib/prisma-client";
import { ProductCard } from "@/components/product/ProductCard";

export default async function HomePage() {
  
  // Ana sayfa tüm ürünleri çeker (findMany)
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const products = dbProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.images[0] || "https://via.placeholder.com/300",
    category_id: product.categoryId, 
    is_featured: false, 
    created_at: product.createdAt.toISOString()
  }));

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Vitrin Ürünleri
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Henüz ürün eklenmemiş.</p>
          </div>
        )}
      </div>
    </main>
  );
}