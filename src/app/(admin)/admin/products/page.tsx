<<<<<<< HEAD
import { prisma } from "@/lib/prisma-client";
import ProductDataTable from "@/components/admin/products/ProductDataTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    status?: string;
    isActive?: string;
  }>;
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  const searchParams = await props.searchParams;

  const query = searchParams.q || "";
  const sortParam = searchParams.sort || "createdAt_desc";
  const statusParam = searchParams.status; // 'list' veya 'archived'
  const isActiveParam = searchParams.isActive;

  // 1. SIRALAMA
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };
  if (sortParam === "stock_asc") orderBy = { stock: "asc" };
  if (sortParam === "stock_desc") orderBy = { stock: "desc" };
  if (sortParam === "name_asc") orderBy = { name: "asc" };

  // 2. FİLTRELEME MANTIĞI (Burayı sıkılaştırdık)
  // Eğer URL'de ?status=archived varsa -> SADECE Arşivlileri göster.
  // Yoksa (Varsayılan) -> SADECE Arşivde OLMAYANLARI göster.
  const isViewingArchived = statusParam === "archived";

  const where: Prisma.ProductWhereInput = {
    AND: [
      // 🔥 KESİN KURAL: Sekme neyse ona göre getir.
      // Arşiv sekmesindeysek isArchived: true, değilsek isArchived: false zorunlu.
      { isArchived: isViewingArchived },

      // Satış Durumu Filtresi (Sadece Liste modunda çalışır)
      // Seçim yapılmadıysa hepsini getir, yapıldıysa filtrele.
      !isViewingArchived && isActiveParam
        ? { isActive: isActiveParam === "true" }
        : {},

      // Arama Kutusu
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { category: { name: { contains: query, mode: "insensitive" } } },
              ...(query.length > 20 ? [{ id: { equals: query } }] : []),
            ],
          }
        : {},
    ],
  };

  // 3. VERİ ÇEKME
  const rawProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      images: true,
      brand: true,
    },
  });

  // 4. FORMATLAMA
  const products = rawProducts.map((p) => {
    const imageList = p.images || [];
    const mainImage = imageList.find((img) => img.isMain) || imageList[0];

    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      isActive: p.isActive,
      isArchived: p.isArchived,
      categoryName: p.category?.name || "Kategorisiz",
      brandName: p.brand?.name || "-",
      image: mainImage ? mainImage.url : "/placeholder.png",
      createdAt: p.createdAt,
    };
  });

  return (
    <div className="p-6 md:p-10 max-w-[1800px] mx-auto space-y-8 min-h-screen bg-[#F9FAFB]">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Ürün Yönetimi
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Envanterini buradan profesyonelce yönet.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl hover:bg-black hover:shadow-xl hover:shadow-gray-200 active:scale-95 transition-all font-bold group"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform"
          />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* TOOLBAR (Filtreler ve Sekmeler) */}
      <ProductToolbar totalCount={products.length} />

      {/* TABLO ALANI */}
      <div className="bg-white border border-gray-200/60 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <ProductDataTable products={products} />
=======
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma-client";
import ArchiveProductButton from "@/components/admin/ArchiveProductButton";
import { Pencil, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  // Veritabanından ürünleri çekiyorum.
  // Sadece 'isActive: true' olanları getiriyorum ki arşivdekiler burada kalabalık yapmasın.
  // Ayrıca kategori ismini göstermek için 'include' kullandım.
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }, // En son eklenen en üstte görünsün
  });

  return (
    <div className="p-8">
      {/* Üst Kısım: Başlık ve Butonlar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>

        <div className="flex gap-3">
          {/* Çöp Kutusuna Gitme Butonu */}
          <Link
            href="/admin/products/archive"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <Trash2 size={18} /> Arşiv / Çöp Kutusu
          </Link>

          {/* Yeni Ürün Ekleme Sayfasına Gitme Butonu */}
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {/* Ürün Listesi Tablosu */}
      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          {/* Tablo Başlıkları */}
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Resim</th>
              <th className="p-3">Ürün Adı</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>

          {/* Tablo İçeriği (Döngü ile ürünleri basıyorum) */}
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                {/* 1. Ürün Resmi */}
                <td className="p-3">
                  {/* Eğer ürünün resmi varsa göster, yoksa gri boş kutu göster (Hata almamak için) */}
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded border"
                      unoptimized // Dışarıdan yüklenen resimlerde sorun çıkmasın diye
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  )}
                </td>

                {/* 2. Ürün Adı */}
                <td className="p-3 font-medium">{product.name}</td>

                {/* 3. Stok Durumu */}
                <td className="p-3">
                  {/* Stok durumuna göre renk değişimi yapıyorum. Stok varsa Mavi, yoksa Kırmızı uyarı veriyor. */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      product.stock > 0
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock} Adet
                  </span>
                </td>

                {/* 4. Kategori Bilgisi */}
                <td className="p-3 text-gray-600">
                  {/* Kategori silinmişse hata vermesin diye kontrol koydum */}
                  {product.category?.name || "-"}
                </td>

                {/* 5. Fiyat */}
                <td className="p-3 text-green-600 font-bold">
                  {product.price} TL
                </td>

                {/* 6. İşlem Butonları (Düzenle ve Arşivle) */}
                <td className="p-3 text-right flex justify-end gap-2 items-center">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                    title="Düzenle"
                  >
                    <Pencil size={20} />
                  </Link>
                  {/* Bu buton Client Component olduğu için ayrı dosyadan çağırdım */}
                  <ArchiveProductButton id={product.id} />
                </td>
              </tr>
            ))}

            {/* Eğer hiç ürün yoksa boş ekran kalmasın, uyarı versin */}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Şu an yayında olan ürün yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      </div>
    </div>
  );
}
