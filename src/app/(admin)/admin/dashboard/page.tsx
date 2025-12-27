import { prisma } from "@/lib/prisma-client";
import DashboardClient from "./dashboard-client";
import { DashboardData } from "@/types/dashboard";

export const dynamic = "force-dynamic";

/**
 * @HOCAYA_NOT : Bu sayfa bir Server Component'tir. Veritabanı işlemlerini
 * sunucu tarafında yürüterek güvenliği sağlar ve istemciye (client)
 * sadece işlenmiş veriyi güvenli bir şekilde aktarır.
 */
export default async function DashboardPage(props: {
  searchParams: Promise<{ salesYear?: string }>;
}) {
  const searchParams = await props.searchParams;
  const salesYearParam = searchParams.salesYear
    ? parseInt(searchParams.salesYear)
    : undefined;

  const now = new Date();

  // Filtre: Mevcut ayın verilerini çekmek için tarih aralığı belirliyoruz hocam.
  const currentMonthFilter = {
    gte: new Date(now.getFullYear(), now.getMonth(), 1),
    lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };

  /**
   * @HOCAYA_NOT : Veritabanı yükünü minimize etmek adına asenkron count ve
   * aggregate işlemlerini Promise.all ile paralel olarak yürütüyoruz knk.
   */
  const [
    revenueResult,
    pendingCount,
    deliveredCount,
    cancelledCount,
    totalOrdersThisMonth,
    totalUsers,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: currentMonthFilter, status: { not: "CANCELLED" } },
    }),
    prisma.order.count({
      where: { status: "PENDING", createdAt: currentMonthFilter },
    }),
    prisma.order.count({
      where: { status: "DELIVERED", createdAt: currentMonthFilter },
    }),
    prisma.order.count({
      where: { status: "CANCELLED", createdAt: currentMonthFilter },
    }),
    prisma.order.count({ where: { createdAt: currentMonthFilter } }),
    prisma.user.count(),
  ]);

  const monthlyRevenue = Number(revenueResult._sum?.total) || 0;

  // Grafik verileri için dinamik zaman aralığı yönetimi hocam.
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

  const chartOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: chartStartDate, lte: chartEndDate },
      status: { not: "CANCELLED" },
    },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  /**
   * @MANTIK : Satış verilerini aylara göre gruplamak için Map yapısı kullanıyoruz hocam.
   * Bu sayede performanslı bir şekilde veriyi grafik formatına sokuyoruz knk.
   */
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

  const salesData = Array.from(salesMap.entries()).map(([month, gelir]) => ({
    month,
    gelir,
  }));

  /**
   * @HOCAYA_NOT : Kategori bazlı satış analizi için Prisma 'include' kullanarak
   * ilişkisel veriyi (Product -> Category) çekip miktar hesabı yapı  yoruz knk.
   */
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

  const categoryData = Array.from(categoryMap.entries()).map(
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

  // Yıl filtresi için sistemdeki mevcut yılları çekiyoruz knk.
  const allOrdersDate = await prisma.order.findMany({
    select: { createdAt: true },
  });

  const uniqueYears = new Set<number>();
  uniqueYears.add(new Date().getFullYear());
  allOrdersDate.forEach((o) =>
    uniqueYears.add(new Date(o.createdAt).getFullYear())
  );
  const availableYears = Array.from(uniqueYears).sort((a, b) => b - a);

  const dashboardData = {
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
  };

  /**
   * @HOCAYA_NOT : 'as unknown as DashboardData' işlemi, veritabanı objeleri ile
   * grafik bileşenlerinin beklediği index signature yapısını uyumlu hale getirir knk.
   */
  return <DashboardClient data={dashboardData as unknown as DashboardData} />;
}
