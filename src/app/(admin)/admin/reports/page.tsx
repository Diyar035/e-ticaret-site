import { prisma } from "@/lib/prisma-client";
import ReportsClient from "./reports-client";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// 1. Tip tanımlarını Prisma'nın kendi tiplerinden türeterek "any" kullanımını bitiriyoruz
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    user: {
      select: {
        phoneNumber: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;

export default async function ReportsPage(props: {
  searchParams: Promise<{ customer?: string; start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;

  // 2. Filtreleme kriterini Prisma tipiyle tanımlıyoruz
  const whereCriteria: Prisma.OrderWhereInput = {
    status: "DELIVERED",
  };

  if (searchParams.customer) {
    whereCriteria.OR = [
      {
        customerName: { contains: searchParams.customer, mode: "insensitive" },
      },
      {
        customerEmail: { contains: searchParams.customer, mode: "insensitive" },
      },
    ];
  }

  // 3. Veritabanı sorgusu
  const [salesStats, allOrders] = await Promise.all([
    prisma.order.aggregate({
      where: whereCriteria,
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.findMany({
      where: whereCriteria,
      include: {
        items: { include: { product: true } },
        user: {
          select: {
            phoneNumber: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // 4. Verileri Client'a göndermeden önce formatlıyoruz
  const reportDataset = {
    revenue: Number(salesStats._sum.total) || 0,
    deliveredCount: salesStats._count.id || 0,
    salesData: [],
    recentOrders: (allOrders as OrderWithRelations[]).map((order) => ({
      id: order.id,
      customer:
        order.customerName ||
        (order.user
          ? `${order.user.firstName} ${order.user.lastName}`
          : "Bilinmeyen"),
      email: order.customerEmail || order.user?.email || "N/A",
      // Şemandaki phoneNumber alanını buraya bağladık
      phone: order.user?.phoneNumber || "-",
      amount: Number(order.total),
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString("tr-TR"),
      details: order.items?.map((oi) => oi.product?.name).join(", ") || "-",
    })),
    availableUsers: [],
  };

  return <ReportsClient data={reportDataset} />;
}
