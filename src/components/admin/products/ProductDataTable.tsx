"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Archive,
  EyeOff,
  CheckSquare,
  Square,
  Trash2,
  RefreshCcw,
  Loader2,
  Pencil,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import {
  bulkArchiveProducts,
  bulkDeleteProducts,
  bulkUpdateStatus,
  toggleProductArchive,
  deleteProduct,
} from "@/actions/product-actions";
import SortableHeader from "./SortableHeader";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isArchived: boolean;
  categoryName: string;
  brandName: string;
  image: string;
}

interface Props {
  products: ProductRow[];
}

type ConfirmationType =
  | "SINGLE_ARCHIVE"
  | "SINGLE_RESTORE"
  | "SINGLE_DELETE"
  | "BULK_ARCHIVE"
  | "BULK_RESTORE"
  | "BULK_DELETE"
  | "BULK_ACTIVATE"
  | "BULK_DEACTIVATE"
  | null;

interface ConfirmationState {
  isOpen: boolean;
  type: ConfirmationType;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  isDangerous: boolean;
  data: { id?: string } | null;
}

export default function ProductDataTable({ products }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isArchivedTab = searchParams.get("status") === "archived";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    confirmLabel: "",
    isDangerous: false,
    data: null,
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) setSelectedIds([]);
    else setSelectedIds(products.map((p) => p.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // --- MODAL İSTEK FONKSİYONLARI ---
  const requestSingleArchive = (id: string, isArchived: boolean) => {
    setConfirmation({
      isOpen: true,
      type: isArchived ? "SINGLE_RESTORE" : "SINGLE_ARCHIVE",
      title: isArchived ? "Yayına Al" : "Ürünü Arşivle",
      description: isArchived
        ? "Bu ürünü tekrar listeye almak istediğinize emin misiniz?"
        : "Bu ürünü arşivlemek istediğinize emin misiniz? Satıştan kaldırılacaktır.",
      confirmLabel: isArchived ? "Evet, Geri Yükle" : "Evet, Arşivle",
      isDangerous: false,
      data: { id },
    });
  };

  const requestSingleDelete = (id: string) => {
    setConfirmation({
      isOpen: true,
      type: "SINGLE_DELETE",
      title: "Kalıcı Olarak Sil",
      description: "Bu işlem geri alınamaz! Emin misiniz?",
      confirmLabel: "Evet, Sil",
      isDangerous: true,
      data: { id },
    });
  };

  const requestBulkStatusChange = (isActive: boolean) => {
    setConfirmation({
      isOpen: true,
      type: isActive ? "BULK_ACTIVATE" : "BULK_DEACTIVATE",
      title: isActive ? "Toplu Satışa Açma" : "Toplu Satışa Kapatma",
      description: (
        <>
          Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} ürünü
          </strong>{" "}
          {isActive ? "satışa açmak" : "satışa kapatmak"} istediğinize emin
          misiniz?
        </>
      ),
      confirmLabel: isActive ? "Evet, Satışa Aç" : "Evet, Satışa Kapat",
      isDangerous: !isActive,
      data: null,
    });
  };

  const requestBulkArchive = (archive: boolean) => {
    setConfirmation({
      isOpen: true,
      type: archive ? "BULK_ARCHIVE" : "BULK_RESTORE",
      title: archive ? "Toplu Arşivleme" : "Toplu Geri Yükleme",
      description: (
        <>
          Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} ürünü
          </strong>{" "}
          {archive ? "arşivlemek" : "geri yüklemek"} istediğinize emin misiniz?
        </>
      ),
      confirmLabel: archive ? "Hepsini Arşivle" : "Hepsini Geri Yükle",
      isDangerous: false,
      data: null,
    });
  };

  const requestBulkDelete = () => {
    setConfirmation({
      isOpen: true,
      type: "BULK_DELETE",
      title: "Toplu Kalıcı Silme",
      description: (
        <>
          DİKKAT! Seçilen{" "}
          <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {selectedIds.length} ürün
          </strong>{" "}
          KALICI OLARAK silinecek.
        </>
      ),
      confirmLabel: "Hepsini Sil",
      isDangerous: true,
      data: null,
    });
  };

  // --- İŞLEMİ GERÇEKLEŞTİR ---
  const handleConfirmAction = () => {
    if (!confirmation.type) return;

    startTransition(async () => {
      if (confirmation.type === "SINGLE_ARCHIVE" && confirmation.data?.id)
        await toggleProductArchive(confirmation.data.id, true);
      else if (confirmation.type === "SINGLE_RESTORE" && confirmation.data?.id)
        await toggleProductArchive(confirmation.data.id, false);
      else if (confirmation.type === "SINGLE_DELETE" && confirmation.data?.id)
        await deleteProduct(confirmation.data.id);
      else if (confirmation.type === "BULK_ARCHIVE") {
        await bulkArchiveProducts(selectedIds, true);
        setSelectedIds([]);
      } else if (confirmation.type === "BULK_RESTORE") {
        await bulkArchiveProducts(selectedIds, false);
        setSelectedIds([]);
      } else if (confirmation.type === "BULK_DELETE") {
        await bulkDeleteProducts(selectedIds);
        setSelectedIds([]);
      } else if (confirmation.type === "BULK_ACTIVATE") {
        await bulkUpdateStatus(selectedIds, true);
        setSelectedIds([]);
      } else if (confirmation.type === "BULK_DEACTIVATE") {
        await bulkUpdateStatus(selectedIds, false);
        setSelectedIds([]);
      }

      router.refresh();
      setConfirmation({ ...confirmation, isOpen: false });
    });
  };

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto min-h-[400px] transition-all duration-300 ${confirmation.isOpen ? "blur-sm pointer-events-none" : ""}`}
      >
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-5 w-14 text-center">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-400 hover:text-indigo-600"
                >
                  {products.length > 0 &&
                  selectedIds.length === products.length ? (
                    <CheckSquare size={20} className="text-indigo-600" />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
              </th>
              <th className="p-5 w-20 text-xs font-bold text-gray-400 uppercase text-center">
                Görsel
              </th>
              <SortableHeader label="Ürün Adı" sortKey="name" />
              <SortableHeader label="Fiyat" sortKey="price" />
              <SortableHeader label="Stok" sortKey="stock" />
              <th className="p-5 text-xs font-bold text-gray-500 uppercase">
                Kategori
              </th>
              <th className="p-5 text-xs font-bold text-gray-500 uppercase">
                Durum
              </th>
              <th className="p-5 text-right text-xs font-bold text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <tr
                  key={product.id}
                  className={`group transition-colors duration-200 ${isSelected ? "bg-indigo-50/40" : "hover:bg-gray-50/80"}`}
                >
                  <td className="p-5 text-center relative">
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500" />
                    )}
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      {isSelected ? (
                        <CheckSquare size={20} className="text-indigo-600" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-bold text-gray-900 hover:text-indigo-600"
                    >
                      {product.name}
                    </Link>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {product.id.slice(-6).toUpperCase()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 bg-gray-50/50 px-2 py-1 rounded border border-transparent">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(product.price)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm ${product.stock === 0 ? "bg-red-500" : product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"}`}
                      />
                      <span className="text-gray-700">
                        {product.stock} Adet
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {product.categoryName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.brandName}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    {product.isArchived ? (
                      <Badge variant="gray" icon={<Archive size={12} />}>
                        Arşivde
                      </Badge>
                    ) : product.isActive ? (
                      <Badge variant="green" icon={<CheckCircle2 size={12} />}>
                        Satışta
                      </Badge>
                    ) : (
                      <Badge variant="red" icon={<EyeOff size={12} />}>
                        Satışa Kapalı
                      </Badge>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() =>
                          requestSingleArchive(product.id, product.isArchived)
                        }
                        className={`p-2 rounded-lg ${product.isArchived ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"}`}
                      >
                        {product.isArchived ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Archive size={18} />
                        )}
                      </button>
                      {product.isArchived && (
                        <button
                          onClick={() => requestSingleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4 ring-1 ring-gray-100">
              <Package size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ürün Bulunamadı</h3>
            <p className="text-gray-500 mt-1 max-w-xs">
              Aradığınız kriterlere uygun ürün yok.
            </p>
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-full p-2 pl-6 flex items-center gap-3 ring-1 ring-gray-900/5">
            <span className="text-sm font-medium flex items-center gap-2 mr-2 text-gray-700">
              <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </span>
              seçildi
            </span>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {!isArchivedTab ? (
              <>
                <button
                  onClick={() => requestBulkStatusChange(true)}
                  disabled={isPending}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <PlayCircle size={16} />
                  )}{" "}
                  Satışa Aç
                </button>
                <button
                  onClick={() => requestBulkStatusChange(false)}
                  disabled={isPending}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <StopCircle size={16} />
                  )}{" "}
                  Satışa Kapat
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                <button
                  onClick={() => requestBulkArchive(true)}
                  disabled={isPending}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Archive size={16} />
                  )}{" "}
                  Arşivle
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => requestBulkArchive(false)}
                  disabled={isPending}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <RefreshCcw size={16} />
                  )}{" "}
                  Geri Yükle
                </button>
                <button
                  onClick={requestBulkDelete}
                  disabled={isPending}
                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Trash2 size={16} />
                  )}{" "}
                  Kalıcı Sil
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full mx-6 border border-white/20 relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-full h-2 opacity-50 ${confirmation.isDangerous ? "bg-red-500" : "bg-indigo-500"}`}
            />
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {confirmation.title}
              </h3>
              <div className="text-gray-500 mb-8">
                {confirmation.description}
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() =>
                    setConfirmation({ ...confirmation, isOpen: false })
                  }
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl border-2 border-gray-100"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`w-full font-bold py-4 rounded-2xl text-white shadow-xl ${confirmation.isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin inline" />
                  ) : (
                    confirmation.confirmLabel
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({
  children,
  variant,
  icon,
}: {
  children: React.ReactNode;
  variant: "green" | "red" | "gray";
  icon: React.ReactNode;
}) {
  const styles = {
    green:
      "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-600/20",
    red: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-600/20",
    gray: "bg-gray-100 text-gray-600 border-gray-200 ring-gray-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ring-inset ${styles[variant]}`}
    >
      {icon}
      {children}
    </span>
  );
}
