import { prisma } from "@/lib/prisma-client";
import { CategoryForm } from "./components/CategoryForm";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;

  // 1. Tüm yardımcı verileri çekiyoruz (Formda seçmek için)
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const attributes = await prisma.attribute.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Yeni kayıt ise boş form döndür
  if (params.categoryId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm
            initialData={null}
            categories={categories}
            brands={brands}
            attributes={attributes}
          />
        </div>
      </div>
    );
  }

  // 3. Düzenleme ise mevcut veriyi (Marka ve Özellik ilişkileriyle beraber) çek
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      brands: true, // Kategoriye bağlı markalar gelsin
      attributes: true, // Kategoriye bağlı özellikler gelsin
    },
  });

  if (!category) {
    return <div>Kategori bulunamadı.</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          initialData={category}
          categories={categories}
          brands={brands}
          attributes={attributes}
        />
      </div>
    </div>
  );
}
