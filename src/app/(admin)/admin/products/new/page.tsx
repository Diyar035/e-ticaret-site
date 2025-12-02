import { prisma } from "@/lib/prisma-client";
import NewProductForm from "@/components/admin/NewProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Ürün Ekle</h1>

      {/* Tüm formu buraya devrettik */}
      <NewProductForm categories={categories} />
    </div>
  );
}
