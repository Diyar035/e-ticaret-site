import { prisma } from "@/lib/prisma-client";
import ReportsClient from "./reports-client";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// 1. Tip tanımlarını Prisma'nın kendi yapısından türeterek 'any' kullanımını bitirdik.
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

// Interface tanımlayarak ESLint hatalarını gideriyoruz.
interface ReportOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  amount: number;
  status: string;
  date: string;
  details: string;
  itemsCount: number;
}

interface ReportDataset {
  revenue: number;
  deliveredCount: number;
  salesData: { month: string; gelir: number }[];
  recentOrders: ReportOrder[];
  availableYears: number[];
}

export default async function ReportsPage(props: {
  searchParams: Promise<{ customer?: string; start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;

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

  // Veritabanı sorgusu
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

  // Verileri formatlayıp 'any' yerine hazırladığımız interfaceleri kullanıyoruz.
  const reportDataset: ReportDataset = {
    revenue: Number(salesStats._sum.total) || 0,
    deliveredCount: salesStats._count.id || 0,
    salesData: [], // İstatistik gerekirse buraya eklenebilir.
    availableYears: [2024, 2025],
    recentOrders: (allOrders as OrderWithRelations[]).map((order) => {
      // Adet hesaplaması (Aynı üründen 2 tane varsa artık doğru sayar)
      const totalQty =
        order.items?.reduce((sum, item) => sum + item.quantity, 0)   || 0;

      return {
        id: order.id,
        customer:
          order.customerName ||
          (order.user
            ? `${order.user.firstName} ${order.user.lastName}`
            : "Bilinmeyen"),
        email: order.customerEmail || order.user?.email || "N/A",
        phone: order.user?.phoneNumber || "-",
        amount: Number(order.total),
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString("tr-TR"),
        details:
          order.items
            ?.map((oi) => `${oi.product?.name} (x${oi.quantity})`)
            .join(", ") || "-",
        itemsCount: totalQty,
      };
    }),
  };

  return <ReportsClient data={reportDataset} />;
}
