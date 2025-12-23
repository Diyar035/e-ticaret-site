import { prisma } from "@/lib/prisma-client";
// 🔥 ÖNEMLİ: Burası OrdersClient DEĞİL, DashboardClient olmalı!
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

interface SalesItem {
  month: string;
  gelir: number;
}
interface CategoryItem {
  name: string;
  value: number;
}
interface DashboardPageProps {
  searchParams: Promise<{ salesYear?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const salesYearParam = searchParams.salesYear
    ? parseInt(searchParams.salesYear)
    : undefined;
  const now = new Date();

  const currentMonthFilter = {
    gte: new Date(now.getFullYear(), now.getMonth(), 1),
    lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };

  let chartStartDate: Date;
  let chartEndDate: Date | undefined;
  let isCustomYear = false;

  if (salesYearParam) {
    chartStartDate = new Date(salesYearParam, 0, 1);
    chartEndDate = new Date(salesYearParam, 11, 31, 23, 59, 59);
    isCustomYear = true;
  } else {
    chartStartDate = new Date();
    chartStartDate.setMonth(now.getMonth() - 6);
    chartStartDate.setDate(1);
    chartEndDate = undefined;
  }

  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { createdAt: currentMonthFilter, status: { not: "CANCELLED" } },
  });
  const monthlyRevenue = Number(revenueResult._sum?.total) || 0;

  const pendingCount = await prisma.order.count({
    where: { status: "PENDING", createdAt: currentMonthFilter },
  });
  const deliveredCount = await prisma.order.count({
    where: { status: "DELIVERED", createdAt: currentMonthFilter },
  });
  const cancelledCount = await prisma.order.count({
    where: { status: "CANCELLED", createdAt: currentMonthFilter },
  });
  const totalOrdersThisMonth = await prisma.order.count({
    where: { createdAt: currentMonthFilter },
  });
  const totalUsers = await prisma.user.count();

  const chartOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: chartStartDate, lte: chartEndDate },
      status: { not: "CANCELLED" },
    },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  const salesMap = new Map<string, number>();
  if (isCustomYear) {
    for (let i = 0; i < 12; i++) {
      const d = new Date(salesYearParam!, i, 1);
      const monthName = d.toLocaleDateString("tr-TR", { month: "short" });
      salesMap.set(monthName, 0);
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const monthName = d.toLocaleDateString("tr-TR", { month: "short" });
      salesMap.set(monthName, 0);
    }
  }

  chartOrders.forEach((order) => {
    const monthName = new Date(order.createdAt).toLocaleDateString("tr-TR", {
      month: "short",
    });
    if (salesMap.has(monthName)) {
      salesMap.set(
        monthName,
        (salesMap.get(monthName) || 0) + Number(order.total)
      );
    }
  });

  const salesData: SalesItem[] = Array.from(salesMap.entries()).map(
    ([month, gelir]) => ({ month, gelir })
  );

  const soldItems = await prisma.orderItem.findMany({
    take: 500,
    where: { order: { status: { not: "CANCELLED" } } },
    include: { product: { include: { category: true } } },
  });
  const categoryMap = new Map<string, number>();
  soldItems.forEach((item) => {
    const categoryName = item.product?.category?.name || "Diğer";
    categoryMap.set(
      categoryName,
      (categoryMap.get(categoryName) || 0) + item.quantity
    );
  });
  const categoryData: CategoryItem[] = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  const recentOrders = await prisma.order.findMany({
    where: { createdAt: currentMonthFilter },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  });
  const formattedOrders = recentOrders.map((order) => ({
    id: order.id,
    customer: order.user
      ? `${order.user.firstName} ${order.user.lastName}`
      : "Misafir",
    amount: Number(order.total),
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString("tr-TR"),
  }));

  const allOrdersDate = await prisma.order.findMany({
    select: { createdAt: true },
  });
  const uniqueYears = new Set<number>();
  uniqueYears.add(new Date().getFullYear());
  allOrdersDate.forEach((o) =>
    uniqueYears.add(new Date(o.createdAt).getFullYear())
  );
  const availableYears = Array.from(uniqueYears).sort((a, b) => b - a);

  // 🔥 BURADA DashboardClient'ı çağırıyoruz
  return (
    <DashboardClient
      data={{
        revenue: monthlyRevenue,
        pendingCount,
        deliveredCount,
        cancelledCount,
        ordersCount: totalOrdersThisMonth,
        usersCount: totalUsers,
        productsSoldCount: soldItems.length,
        salesData,
        categoryData,
        recentOrders: formattedOrders,
        availableYears,
      }}
    />
  );
}
