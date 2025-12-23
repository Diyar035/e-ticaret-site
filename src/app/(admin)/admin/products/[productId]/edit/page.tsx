import { prisma } from "@/lib/prisma-client";
import ProductForm from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

// Next.js 15 için tip tanımı (Promise olmalı)
interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // 1. Next.js 15 kuralı: params'ı önce await ediyoruz
  const { productId } = await params;

  // 2. Ürünü tüm detaylarıyla çek
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      variants: true,
      attributeValues: true,
    },
  });

  if (!product) {
    notFound();
  }

  // 3. Kategorileri ve Markaları çek (Select kutuları için)
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          attributes: true,
          brands: true,
        },
      },
      brands: true,
      attributes: true,
    },
  });

  const brands = await prisma.brand.findMany();

  // 4. Decimal Tiplerini Number'a Çevir (Serialization Hatası Almamak İçin)
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : 0, // Varyant fiyat farkı
    })),
  };

  return (
    <div className="p-6">
      <ProductForm
        categories={categories}
        brands={brands}
        initialData={formattedProduct}
      />
    </div>
  );
}
