import { prisma } from "@/lib/prisma-client";
import ProductGallery from "@/components/product/ProductGallery"; // Senin oluşturduğun galeri
import { notFound } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react"; // İkonlar

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // 1. Ürünü Veritabanından Bul
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  // Ürün yoksa 404 ver
  if (!product) return notFound();

  return (
    <div className="container mx-auto p-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* --- SOL TARAFTAKİ GALERİ --- */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* --- SAĞ TARAFTAKİ BİLGİLER --- */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full">
              {product.category?.name || "Genel"}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mt-4">
              {product.name}
            </h1>

            {/* Temsili Yıldızlar */}
            <div className="flex items-center gap-1 mt-2 text-yellow-400">
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <span className="text-gray-400 text-sm ml-2">(Yeni Ürün)</span>
            </div>
          </div>

          <div className="text-gray-600 leading-relaxed">
            {product.description}
          </div>

          <div className="flex items-end gap-4 border-b border-gray-100 pb-6">
            <span className="text-5xl font-bold text-gray-900">
              {product.price}
            </span>
            <span className="text-2xl font-medium text-gray-500 mb-1">TL</span>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
              <ShoppingCart /> Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
