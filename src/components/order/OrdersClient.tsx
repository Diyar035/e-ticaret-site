"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { bulkUpdateOrderStatus } from "@/actions/order-actions";
import { OrderStatus } from "@prisma/client";
import {
  CheckSquare,
  Square,
  ArrowRight,
  Loader2,
  Package,
  Layers,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  User,
  Fingerprint,
  Calendar,
  ExternalLink,
  MoreVertical,
  Undo2,
  Ban,
  RefreshCcw,
  CheckCircle2,
  Truck,
  Box,
  AlertTriangle,
  Info,
} from "lucide-react";

// --- TİPLER ---
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address?: string | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
  totalQuantity: number;
  items: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
  counts: Record<string, number>;
  searchQuery: string;
}

// --- VURGULAMA BİLEŞENİ ---
const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="bg-yellow-100 text-gray-900 font-semibold px-0.5 rounded"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// --- CONFIRMATION STATE (MODAL AYARLARI) ---
type ConfirmationType =
  | "SINGLE_CANCEL"
  | "BULK_CANCEL"
  | "BULK_UPDATE"
  | "SINGLE_UPDATE"
  | "BULK_RESTORE"
  | null;

interface ConfirmationState {
  isOpen: boolean;
  type: ConfirmationType;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  isDangerous: boolean;
  data: { id?: string; nextStatus?: OrderStatus } | null;
}

// --- TABS & STATUS HELPERS ---
const TABS = [
  {
    id: "PENDING",
    label: "Bekleyenler",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    countColor: "bg-amber-200 text-amber-800",
  },
  {
    id: "PROCESSING",
    label: "Hazırlanıyor",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    countColor: "bg-blue-200 text-blue-800",
  },
  {
    id: "SHIPPED",
    label: "Kargolandı",
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    countColor: "bg-indigo-200 text-indigo-800",
  },
  {
    id: "DELIVERED",
    label: "Teslim Edildi",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    countColor: "bg-emerald-200 text-emerald-800",
  },
  {
    id: "CANCELLED",
    label: "İptal/İade",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    countColor: "bg-rose-200 text-rose-800",
  },
];

const getStatusLabel = (status: string) => {
  const found = TABS.find((t) => t.id === status);
  return found ? found.label : status;
};

export default function OrdersClient({
  orders,
  counts,
  searchQuery,
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("status") || "PENDING";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // 🔥 MERKEZİ ONAY SİSTEMİ STATE'İ
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    confirmLabel: "",
    isDangerous: false,
    data: null,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ACTIONS ---
  const handleTabChange = (status: string) => {
    setSelectedIds([]);
    setExpandedIds([]);
    setActiveMenuId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === orders.length ? [] : orders.map((o) => o.id)
    );
  };

  const toggleDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Diğer açık menüleri kapatıp sadece tıklananı aç
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "PENDING") return "PROCESSING";
    if (status === "PROCESSING") return "SHIPPED";
    if (status === "SHIPPED") return "DELIVERED";
    return null;
  };

  const getPrevStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "DELIVERED") return "SHIPPED";
    if (status === "SHIPPED") return "PROCESSING";
    if (status === "PROCESSING") return "PENDING";
    return null;
  };

  const getNextStatusAction = () => {
    if (currentTab === "PENDING")
      return {
        label: "Hazırlanıyor'a Aktar",
        next: "PROCESSING" as OrderStatus,
        color: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20",
      };
    if (currentTab === "PROCESSING")
      return {
        label: "Kargolandı İşaretle",
        next: "SHIPPED" as OrderStatus,
        color:
          "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
      };
    if (currentTab === "SHIPPED")
      return {
        label: "Teslim Edildi Yap",
        next: "DELIVERED" as OrderStatus,
        color:
          "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20",
      };
    return null;
  };

  // --- 🔥 MODAL TETİKLEYİCİLERİ (REQUEST FUNCTIONS) ---

  // 1. Tekli İptal
  const requestSingleCancel = (id: string) => {
    setConfirmation({
      isOpen: true,
      type: "SINGLE_CANCEL",
      title: "Siparişi İptal Et?",
      description:
        "Bu işlemi onaylarsanız sipariş kalıcı olarak iptal edilecektir. Bu işlem geri alınabilir.",
      confirmLabel: "Evet, İptal Et",
      isDangerous: true,
      data: { id },
    });
    setActiveMenuId(null);
  };

  // 2. Toplu İptal
  const requestBulkCancel = () => {
    setConfirmation({
      isOpen: true,
      type: "BULK_CANCEL",
      title: "Toplu İptal Onayı",
      description: (
        <div className="text-center">
          Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} adet
          </strong>{" "}
          siparişi iptal etmek istediğinize emin misiniz?
        </div>
      ),
      confirmLabel: "Hepsini İptal Et",
      isDangerous: true,
      data: null,
    });
  };

  // 3. Toplu Geri Yükleme
  const requestBulkRestore = () => {
    setConfirmation({
      isOpen: true,
      type: "BULK_RESTORE",
      title: "Sisteme Geri Dahil Et",
      description: (
        <div className="text-center">
          Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} adet
          </strong>{" "}
          iptal edilmiş siparişi tekrar aktif (Bekleyen) duruma getirmek istiyor
          musunuz?
        </div>
      ),
      confirmLabel: "Evet, Dahil Et",
      isDangerous: false, // Yeşil buton
      data: null,
    });
  };

  // 4. Toplu İlerleme (Next Action)
  const requestBulkUpdate = () => {
    const action = getNextStatusAction();
    if (!action) return;
    setConfirmation({
      isOpen: true,
      type: "BULK_UPDATE",
      title: "Durum Güncellemesi",
      description: (
        <div className="text-center">
          Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} adet
          </strong>{" "}
          siparişi <strong className="text-indigo-600">{action.label}</strong>{" "}
          işlemine tabi tutmak istiyor musunuz?
        </div>
      ),
      confirmLabel: "Evet, Onayla",
      isDangerous: false,
      data: { nextStatus: action.next },
    });
  };

  // 5. Tekli Durum Değişikliği (Menüden)
  const requestSingleUpdate = (id: string, newStatus: OrderStatus) => {
    const statusLabel = getStatusLabel(newStatus);
    const title =
      newStatus === "PENDING" ? "Sisteme Geri Dahil Et" : "Aşama Değişikliği";
    const confirmLabel =
      newStatus === "PENDING" ? "Evet, Dahil Et" : "Evet, Değiştir";
    // Eğer restore işlemiyse yeşil, diğerleriyse mavi ton
    const colorClass =
      newStatus === "PENDING"
        ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"
        : "text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded";

    setConfirmation({
      isOpen: true,
      type: "SINGLE_UPDATE",
      title: title,
      description: (
        <div className="text-center">
          Bu siparişi <strong className={colorClass}>{statusLabel}</strong>{" "}
          durumuna getirmek istediğinize emin misiniz?
        </div>
      ),
      confirmLabel: confirmLabel,
      isDangerous: false,
      data: { id, nextStatus: newStatus },
    });
    setActiveMenuId(null);
  };

  // --- 🔥 İŞLEMİ GERÇEKLEŞTİRME (HANDLE CONFIRM) ---
  const handleConfirmAction = async () => {
    if (!confirmation.type) return;
    setIsUpdating(true);

    try {
      if (confirmation.type === "SINGLE_CANCEL" && confirmation.data?.id) {
        await bulkUpdateOrderStatus([confirmation.data.id], "CANCELLED");
      } else if (confirmation.type === "BULK_CANCEL") {
        await bulkUpdateOrderStatus(selectedIds, "CANCELLED");
        setSelectedIds([]);
        setExpandedIds([]);
      } else if (confirmation.type === "BULK_RESTORE") {
        await bulkUpdateOrderStatus(selectedIds, "PENDING");
        setSelectedIds([]);
        setExpandedIds([]);
      } else if (
        confirmation.type === "BULK_UPDATE" &&
        confirmation.data?.nextStatus
      ) {
        await bulkUpdateOrderStatus(selectedIds, confirmation.data.nextStatus);
        setSelectedIds([]);
        setExpandedIds([]);
      } else if (
        confirmation.type === "SINGLE_UPDATE" &&
        confirmation.data?.id &&
        confirmation.data?.nextStatus
      ) {
        await bulkUpdateOrderStatus(
          [confirmation.data.id],
          confirmation.data.nextStatus
        );
      }

      router.refresh();
      setConfirmation({ ...confirmation, isOpen: false });
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextAction = getNextStatusAction();

  return (
    <>
      <div
        className={`space-y-8 pb-36 transition-all duration-300 ${confirmation.isOpen ? "blur-[2px] grayscale-[0.3] pointer-events-none" : ""}`}
      >
        {/* SEKME MENÜSÜ */}
        <div className="sticky top-0 z-20 bg-[#F9FAFB]/90 backdrop-blur-md pt-4 border-b border-gray-200">
          <nav className="flex space-x-2 overflow-x-auto no-scrollbar px-2 pb-0">
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              const count = counts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative pb-4 px-4 font-medium text-sm flex items-center gap-3 transition-all outline-none whitespace-nowrap
                    ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="text-base tracking-tight">{tab.label}</span>
                  <span
                    className={`py-0.5 px-2.5 rounded-full text-xs font-bold transition-colors ${isActive ? tab.countColor : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"}`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full ${tab.color.split(" ")[0].replace("text", "bg")}`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BİLGİ */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Layers size={14} className="text-indigo-600" />
            <span>
              Toplam{" "}
              <strong className="text-gray-900 font-bold">
                {orders.length}
              </strong>{" "}
              sipariş listeleniyor
            </span>
          </div>
        </div>

        {/* YÜZEN AKSİYON BARI (Floating Action Bar) */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 pl-6 flex items-center gap-4 ring-1 ring-gray-900/5">
              <span className="text-sm font-medium flex items-center gap-2 mr-2 text-gray-700">
                <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {selectedIds.length}
                </span>
                seçildi
              </span>

              <div className="h-6 w-px bg-gray-300 mx-1"></div>

              {/* İPTAL BUTONU (Sadece aktif siparişlerde görünür) */}
              {currentTab !== "CANCELLED" && currentTab !== "DELIVERED" && (
                <button
                  onClick={requestBulkCancel}
                  disabled={isUpdating}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <Ban size={16} /> İptal Et
                </button>
              )}

              {/* 🔥 RESTORE BUTONU (Sadece İptal sekmesinde görünür) */}
              {currentTab === "CANCELLED" && (
                <button
                  onClick={requestBulkRestore}
                  disabled={isUpdating}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCcw size={16} /> Sisteme Dahil Et
                </button>
              )}

              {/* İLERLE BUTONU (İptal/Teslim hariç) */}
              {nextAction && (
                <button
                  onClick={requestBulkUpdate}
                  disabled={isUpdating}
                  className={`${nextAction.color} text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95`}
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {nextAction.label}
                </button>
              )}
            </div>
          </div>
        )}

        {/* TABLO */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-visible">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50">
              <div className="bg-white p-6 rounded-full mb-4 shadow-sm border border-gray-100">
                <Package size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Sipariş Bulunamadı
              </h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                Bu kategoride şu an işlem bekleyen bir sipariş yok.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="p-5 w-14 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {selectedIds.length === orders.length ? (
                        <CheckSquare size={20} className="text-indigo-600" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </th>
                  <th className="p-5 pl-2">Sipariş Özeti</th>
                  <th className="p-5 text-center w-32">Adet</th>
                  <th className="p-5">Müşteri</th>
                  <th className="p-5 text-right">Tutar</th>
                  <th className="p-5 text-right">Tarih</th>
                  <th className="p-5 text-center w-14"></th>
                  <th className="p-5 text-center w-14"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  const isExpanded = expandedIds.includes(order.id);
                  const isMenuOpen = activeMenuId === order.id;
                  const previewItems = order.items.slice(0, 2);
                  const remainingCount = order.items.length - 2;
                  const nextStatus = getNextStatus(order.status);
                  const prevStatus = getPrevStatus(order.status);

                  const CustomerLink = ({
                    children,
                  }: {
                    children: React.ReactNode;
                  }) => {
                    if (order.userId) {
                      return (
                        <Link
                          href={`/admin/users/${order.userId}`}
                          className="group/link flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-xl -ml-1.5 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {children}
                          <ExternalLink
                            size={12}
                            className="text-gray-300 group-hover/link:text-indigo-500 opacity-0 group-hover/link:opacity-100 transition-all"
                          />
                        </Link>
                      );
                    }
                    return (
                      <div className="flex items-center gap-3 p-1.5">
                        {children}
                      </div>
                    );
                  };

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className={`group transition-all duration-200 hover:bg-gray-50 ${isSelected ? "bg-indigo-50/40" : "bg-white"} ${isExpanded ? "bg-gray-50" : ""}`}
                      >
                        <td className="p-5 text-center relative">
                          {isSelected && (
                            <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500" />
                          )}
                          <button
                            onClick={() => toggleSelect(order.id)}
                            className="text-gray-400 group-hover:text-indigo-600 transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare
                                size={20}
                                className="text-indigo-600"
                              />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        </td>

                        <td
                          className="p-5 pl-2 cursor-pointer"
                          onClick={(e) => toggleDetails(order.id, e)}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                #
                                <Highlight
                                  text={order.id.slice(-6).toUpperCase()}
                                  query={searchQuery}
                                />
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {previewItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="relative w-8 h-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                                >
                                  {item.product.images[0]?.url ? (
                                    <Image
                                      src={item.product.images[0].url}
                                      alt="img"
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Package
                                        size={12}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {remainingCount > 0 && (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                  +{remainingCount}
                                </span>
                              )}
                              <span className="text-sm font-medium text-gray-900 ml-2 line-clamp-1">
                                <Highlight
                                  text={previewItems[0]?.product.name}
                                  query={searchQuery}
                                />
                                {order.items.length > 1 && (
                                  <span className="text-gray-400 font-normal">
                                    {" "}
                                    ve diğerleri...
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-5 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                            {order.totalQuantity}
                          </span>
                        </td>

                        <td className="p-5">
                          <CustomerLink>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shadow-inner">
                              {order.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`font-bold text-sm ${order.userId ? "text-indigo-700" : "text-gray-900"}`}
                              >
                                <Highlight
                                  text={order.customerName}
                                  query={searchQuery}
                                />
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {order.userId ? "Kayıtlı Üye" : "Misafir"}
                              </span>
                            </div>
                          </CustomerLink>
                        </td>

                        <td className="p-5 text-right">
                          <span className="font-bold text-gray-900 text-base tabular-nums">
                            {new Intl.NumberFormat("tr-TR", {
                              style: "currency",
                              currency: "TRY",
                            }).format(order.total)}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            {order.createdAt}
                          </span>
                        </td>

                        <td className="p-5 text-center">
                          <button
                            onClick={(e) => toggleDetails(order.id, e)}
                            className={`p-2 rounded-full transition-all duration-200 ${isExpanded ? "bg-indigo-100 text-indigo-600 rotate-180" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"}`}
                          >
                            <ChevronDown size={20} />
                          </button>
                        </td>

                        <td className="p-5 text-center pr-6 relative">
                          <button
                            onClick={(e) => toggleMenu(order.id, e)}
                            className={`p-2 rounded-full transition-colors ${isMenuOpen ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100 text-gray-400"}`}
                          >
                            <MoreVertical size={20} />
                          </button>

                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              className="absolute right-8 top-8 z-50 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5"
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-4">
                                  İşlemler
                                </div>
                                {nextStatus && (
                                  <button
                                    onClick={() =>
                                      requestSingleUpdate(order.id, nextStatus)
                                    }
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors text-left group/btn"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/btn:bg-indigo-100 transition-colors">
                                      {nextStatus === "SHIPPED" && (
                                        <Truck size={16} />
                                      )}
                                      {nextStatus === "DELIVERED" && (
                                        <CheckCircle2 size={16} />
                                      )}
                                      {nextStatus === "PROCESSING" && (
                                        <Box size={16} />
                                      )}
                                    </div>
                                    <span>Sonraki Aşama</span>
                                  </button>
                                )}
                                {prevStatus && (
                                  <button
                                    onClick={() =>
                                      requestSingleUpdate(order.id, prevStatus)
                                    }
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors text-left group/btn"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover/btn:bg-amber-100 transition-colors">
                                      <Undo2 size={16} />
                                    </div>
                                    <span>Önceki Aşama</span>
                                  </button>
                                )}
                                <div className="h-px bg-gray-100 my-1 mx-2" />
                                {order.status !== "CANCELLED" &&
                                  order.status !== "DELIVERED" && (
                                    <button
                                      onClick={() =>
                                        requestSingleCancel(order.id)
                                      }
                                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                                    >
                                      <Ban size={16} />{" "}
                                      <span>Siparişi İptal Et</span>
                                    </button>
                                  )}
                                {order.status === "CANCELLED" && (
                                  <button
                                    onClick={() =>
                                      requestSingleUpdate(order.id, "PENDING")
                                    }
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                                  >
                                    <RefreshCcw size={16} />{" "}
                                    <span>Sisteme Dahil Et</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50/50 shadow-inner">
                          <td
                            colSpan={8}
                            className="p-0 border-b border-gray-200"
                          >
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-top-4">
                              <div className="lg:col-span-8 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                  <Package size={14} /> Sipariş Ürünleri
                                </h4>
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={item.id}
                                      className={`flex gap-6 p-5 ${idx !== order.items.length - 1 ? "border-b border-gray-50" : ""}`}
                                    >
                                      <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        {item.product.images[0]?.url ? (
                                          <Image
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center h-full">
                                            <Package
                                              size={24}
                                              className="text-gray-300"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col justify-center flex-1">
                                        <span className="text-base font-bold text-gray-900">
                                          <Highlight
                                            text={item.product.name}
                                            query={searchQuery}
                                          />
                                        </span>
                                        <div className="flex items-center gap-3 mt-2">
                                          <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                            <Fingerprint size={10} /> {item.id}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end justify-center">
                                        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                                          x{item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="lg:col-span-4 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                  <User size={14} /> Müşteri & Teslimat
                                </h4>
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                                  <div className="pb-6 border-b border-gray-100">
                                    <CustomerLink>
                                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-2">
                                        {order.customerName
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>
                                      <div>
                                        <div
                                          className={`font-bold text-lg ${order.userId ? "text-indigo-700" : "text-gray-900"}`}
                                        >
                                          <Highlight
                                            text={order.customerName}
                                            query={searchQuery}
                                          />
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                          Müşteri Profili Görüntüle
                                        </div>
                                      </div>
                                    </CustomerLink>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="flex gap-4">
                                      <div className="mt-0.5 p-2 bg-gray-50 rounded-lg">
                                        <Mail
                                          size={16}
                                          className="text-gray-500"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase">
                                          E-posta
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 break-all">
                                          {order.customerEmail || "-"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="mt-0.5 p-2 bg-gray-50 rounded-lg">
                                        <Phone
                                          size={16}
                                          className="text-gray-500"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase">
                                          Telefon
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {order.customerPhone || "-"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="mt-0.5 p-2 bg-gray-50 rounded-lg">
                                        <MapPin
                                          size={16}
                                          className="text-gray-500"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase">
                                          Adres
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 leading-relaxed">
                                          {order.address || "-"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- PREMİUM ONAY MODALI (MERKEZİ) --- */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full mx-6 border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-full h-2 opacity-50 
              ${
                confirmation.isDangerous
                  ? "bg-red-500"
                  : confirmation.type === "BULK_RESTORE" ||
                      (confirmation.type === "SINGLE_UPDATE" &&
                        confirmation.confirmLabel === "Evet, Dahil Et") // Yeşil şerit
                    ? "bg-emerald-500"
                    : "bg-indigo-500"
              }`}
            />

            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl 
                ${
                  confirmation.isDangerous
                    ? "bg-red-50 text-red-500 shadow-red-100"
                    : confirmation.type === "BULK_RESTORE" ||
                        (confirmation.type === "SINGLE_UPDATE" &&
                          confirmation.confirmLabel === "Evet, Dahil Et")
                      ? "bg-emerald-50 text-emerald-500 shadow-emerald-100"
                      : "bg-indigo-50 text-indigo-500 shadow-indigo-100"
                }`}
              >
                {confirmation.isDangerous ? (
                  <AlertTriangle size={36} strokeWidth={2.5} />
                ) : (
                  <Info size={36} strokeWidth={2.5} />
                )}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {confirmation.title}
              </h3>
              <div className="text-gray-500 text-base mb-8 leading-relaxed px-4">
                {confirmation.description}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() =>
                    setConfirmation({ ...confirmation, isOpen: false })
                  }
                  disabled={isUpdating}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-4 rounded-2xl border-2 border-gray-100 transition-all active:scale-95"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isUpdating}
                  className={`w-full font-bold py-4 px-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-white shadow-xl hover:shadow-2xl
                    ${
                      confirmation.isDangerous
                        ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                        : confirmation.type === "BULK_RESTORE" ||
                            (confirmation.type === "SINGLE_UPDATE" &&
                              confirmation.confirmLabel === "Evet, Dahil Et")
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                    }
                  `}
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    confirmation.confirmLabel
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
