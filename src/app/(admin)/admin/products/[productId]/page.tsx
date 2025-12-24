import { prisma } from "@/lib/prisma-client";
import ProductForm from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";
import { ProductWithRelations } from "@/types/product"; // Kendi yazdığın tipi buraya çektik

// Sayfa parametrelerini Next.js 15 formatında alıyoruz
interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // Önce şu meşhur params'ı bi bekleyelim (await)
  const { productId } = await params;

  // Veritabanından ürünü tüm akrabalarıyla (images, variants vs.) çekiyoruz
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      variants: true,
      attributeValues: true,
    },
  });

  // Ürün yoksa zorlamaya gerek yok, direkt 404
  if (!product) {
    notFound();
  }

  // Kategorileri ve markaları formdaki select kutuları dolsun diye çekiyoruz
  const categories = await prisma.category.findMany({
    include: {
      children: { include: { attributes: true, brands: true } },
      brands: true,
      attributes: true,
    },
  });

  const brands = await prisma.brand.findMany();

  // ŞİMDİ DİKKAT: NaN ve Tip hatasını burada gömüyoruz
  // Prisma'dan gelen Decimal ve null gelebilecek değerleri tek tek düzeltiyoruz
  const formattedProduct: ProductWithRelations = {
    ...product,
    price: Number(product.price) || 0,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    stock: product.stock ?? 0, // Eğer stok null ise 0 basıyoruz ki sayfa çökmesin
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : 0,
      stock: v.stock ?? 0, // Varyant stoklarını da sağlama alıyoruz
    })),
  };

  return (
    <div className="p-6">
      {/* Başlıkta ürün ismini gösterelim */}
      <h1 className="text-2xl font-bold mb-6">Ürünü Düzenle: {product.name}</h1>

      {/* Artık 'as any' kullanmamıza gerek kalmadı, formattedProduct tam istediğimiz tipte */}
      <ProductForm
        categories={categories}
        brands={brands}
        initialData={formattedProduct}
      />
    </div>
  );
}
