"use client";

import { useState } from "react";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-hot-toast";

interface CustomersToolbarProps {
  // Soru işareti ekledik (opsiyonel olabilir)
  selectedIds?: string[];
}

// DÜZELTME BURADA: { selectedIds = [] } diyerek varsayılan değer atadık.
// Artık veri gelmezse boş dizi kabul eder ve patlamaz.
export default function CustomersToolbar({
  selectedIds = [],
}: CustomersToolbarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [downloading, setDownloading] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleExport = async () => {
    try {
      setDownloading(true);

      let url = "/api/customers/export";

      if (selectedIds.length > 0) {
        url += `?ids=${selectedIds.join(",")}`;
        toast.success(`${selectedIds.length} kayıt indiriliyor...`);
      } else {
        toast.success("Tüm liste indiriliyor...");
      }

      window.location.href = url;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toast.error("İndirme başarısız.");
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative w-full sm:max-w-md group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("q")?.toString()}
          placeholder="Ara..."
          className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span>
            {selectedIds.length > 0
              ? `Seçilenleri İndir (${selectedIds.length})`
              : "Tümünü İndir"}
          </span>
        </button>
      </div>
    </div>
  );
}
