"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DollarSign,
  Eye, // Bu ikon burada kullanılıyor
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Filter,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// --- SABİTLER ---
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

// --- TİPLER ---
interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface SalesItem {
  month: string;
  gelir: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CategoryItem {
  name: string;
  value: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DashboardDataProps {
  data: {
    revenue: number;
    pendingCount: number;
    deliveredCount: number;
    cancelledCount: number;
    ordersCount: number;
    usersCount: number;
    productsSoldCount: number;
    salesData: SalesItem[];
    categoryData: CategoryItem[];
    recentOrders: Order[];
    availableYears: number[];
  };
}

// --- BİLEŞEN ---
export default function DashboardClient({ data }: DashboardDataProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSalesYear = searchParams.get("salesYear") || "";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  const currentMonthName = new Date().toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set("salesYear", year);
    } else {
      params.delete("salesYear");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const stats = [
    {
      title: "Aylık Ciro",
      value: formatCurrency(data.revenue),
      subText: "Bu ayki toplam kazanç",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Bekleyen Siparişler",
      value: data.pendingCount.toString(),
      subText: "Bu ay işleme alınanlar",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Teslim Edilenler",
      value: data.deliveredCount.toString(),
      subText: "Bu ay teslim edilenler",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "İptal Edilenler",
      value: data.cancelledCount.toString(),
      subText: "Bu ay iptal/iade edilenler",
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
            <p className="text-gray-600 mt-1">
              KervanPazar Mağaza İstatistikleri
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {currentMonthName} Verileri
            </span>
          </div>
        </div>
      </div>

      {/* İstatistikler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-black text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  {stat.subText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Satış Grafiği */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Satış Performansı
            </h2>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={currentSalesYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-700 font-medium cursor-pointer"
              >
                <option value="">Son 6 Ay (Varsayılan)</option>
                {data.availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year} Yılı
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Ciro"]}
                />
                <Bar
                  dataKey="gelir"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Gelir"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pasta Grafiği */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Kategori Dağılımı
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={({ name, percent }: any) =>
                    `${name} %${(percent * 100).toFixed(0)}`
                  }
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Son Siparişler (Bu Ay)
          </h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">
                  Sipariş No
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">
                  Müşteri
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">
                  Tutar
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">
                  Durum
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">
                  Tarih
                </th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-medium text-gray-600">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {order.customer}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_CLASSES[order.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recentOrders.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">Bu ay henüz sipariş bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
