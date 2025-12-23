import { prisma } from "@/lib/prisma-client";
import CustomersClient from "./components/CustomersClient";
import { Users } from "lucide-react";

interface CustomersPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function CustomersPage(props: CustomersPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  // 1. Veriyi Çek
  const customers = await prisma.user.findMany({
    where: {
      role: "USER",
      OR: query
        ? [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 bg-gray-50/30 min-h-screen">
      {/* Başlık Kısmı */}
      <div className="flex items-center gap-3">
        <span className="p-2.5 bg-black text-white rounded-xl shadow-lg">
          <Users size={24} />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Müşteriler</h1>
          <p className="text-sm text-gray-500">
            Toplam {customers.length} kayıt yönetiliyor.
          </p>
        </div>
      </div>

      {/* SADECE BUNU ÇAĞIRIYORUZ - O HER ŞEYİ YÖNETECEK */}
      <CustomersClient data={customers} />
    </div>
  );
}
