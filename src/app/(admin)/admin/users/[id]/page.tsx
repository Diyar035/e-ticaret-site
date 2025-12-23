import { prisma } from "@/lib/prisma-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  ShoppingBag,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage(props: UserPageProps) {
  const params = await props.params;

  // 1. Kullanıcıyı, Siparişlerini VE SÖZLEŞMESİNİ Çek
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      // 🔥 Schema.prisma'ya eklediğin isim 'userAgreement' ise burası çalışır
      userAgreement: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Toplam Harcama
  const totalSpent = user.orders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );

  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen space-y-8">
      {/* --- GERİ DÖN --- */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Siparişlere Dön
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Müşteri Profili
        </h1>
        <p className="text-gray-500 mt-1">
          Müşteri detayları ve işlem geçmişi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL: PROFİL KARTI */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            {/* Arka Plan Dekoru */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10" />

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md mb-4">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ""}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2">
                {user.role === "ADMIN" ? "Yönetici" : "Müşteri"}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {/* E-POSTA */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Mail size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    E-posta
                  </span>
                  <span className="text-sm font-medium text-gray-900 break-all">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* TELEFON */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Phone size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Telefon
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.phoneNumber || "Girilmemiş"}
                  </span>
                </div>
              </div>

              {/* SÖZLEŞME DURUMU */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <FileText size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Kullanıcı Sözleşmesi
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    {user.userAgreement ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                        <CheckCircle size={12} /> Onaylandı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                        <XCircle size={12} /> Onay Yok
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* KAYIT TARİHİ */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Calendar size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Kayıt Tarihi
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 mb-1">
                <ShoppingBag size={20} />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {user.orders.length}
              </div>
              <div className="text-xs text-gray-400 font-bold uppercase">
                Sipariş
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 mb-1">
                <Package size={20} />
              </div>
              <div className="text-xl font-black text-gray-900">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 0,
                }).format(totalSpent)}
              </div>
              <div className="text-xs text-gray-400 font-bold uppercase">
                Harcama
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: SİPARİŞ GEÇMİŞİ */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Package className="text-indigo-600" size={20} />
                Son Siparişleri
              </h3>
            </div>

            {user.orders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                Henüz sipariş vermemiş.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4 pl-6">Sipariş No</th>
                    <th className="p-4">Tarih</th>
                    <th className="p-4">Durum</th>
                    <th className="p-4 text-right pr-6">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-indigo-600">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`
                          px-2 py-1 rounded-lg text-xs font-bold
                          ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }
                        `}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6 font-bold text-gray-900">
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(Number(order.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
