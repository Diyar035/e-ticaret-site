import { prisma } from "@/lib/prisma-client";
import CustomersClient from "./components/CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { createdAt: "desc" },
    });

    const formattedCustomers = (users || []).map((u) => ({
      id: u.id,
      name:
        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
        "Bilinmeyen Müşteri",
      email: u.email || "-",
      phone: u.phoneNumber || "-",
      createdAt: u.createdAt
        ? u.createdAt.toISOString()
        : new Date().toISOString(),
    }));

    return <CustomersClient data={formattedCustomers} />;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return (
      <div className="p-20 text-center font-bold">
        Veritabanı bağlantısı yok.
      </div>
    );
  }
}
