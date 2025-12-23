"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Category, Brand, Attribute } from "@prisma/client";
import {
  Trash,
  Save,
  ArrowLeft,
  Search,
  X,
  ChevronDown,
  Plus,
  Loader2,
  Tag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface CategoryFormProps {
  initialData: (Category & { brands: Brand[]; attributes: Attribute[] }) | null;
  categories: Category[];
  brands: Brand[];
  attributes: Attribute[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  categories,
  brands: initialBrands,
  attributes: initialAttributes,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE'LER ---
  const [name, setName] = useState(initialData?.name || "");
  const [parentId, setParentId] = useState(initialData?.parentId || "");

  // Listeler (Anlık ekleme yapınca buraya düşecek)
  const [brandList, setBrandList] = useState<Brand[]>(initialBrands);
  const [attributeList, setAttributeList] =
    useState<Attribute[]>(initialAttributes);

  // Seçili ID'ler
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    initialData?.brands.map((b) => b.id) || []
  );
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>(
    initialData?.attributes.map((a) => a.id) || []
  );

  const title = initialData ? "Kategoriyi Düzenle" : "Kategori Oluştur";
  const action = initialData ? "Kaydet" : "Oluştur";

  // --- MARKA OLUŞTURMA & EKLEME ---
  const handleCreateBrand = async (brandName: string) => {
    try {
      const response = await axios.post(`/api/brands`, { name: brandName });
      const newBrand = response.data;
      setBrandList((prev) => [...prev, newBrand]);
      setSelectedBrandIds((prev) => [...prev, newBrand.id]);
      toast.success(`"${brandName}" markası oluşturuldu.`);
    } catch (error) {
      console.error(error);
      toast.error("Marka oluşturulamadı.");
    }
  };

  // --- ÖZELLİK OLUŞTURMA & EKLEME ---
  const handleCreateAttribute = async (attributeName: string) => {
    try {
      const response = await axios.post(`/api/attributes`, {
        name: attributeName,
      });
      const newAttribute = response.data;
      setAttributeList((prev) => [...prev, newAttribute]);
      setSelectedAttributeIds((prev) => [...prev, newAttribute.id]);
      toast.success(`"${attributeName}" özelliği oluşturuldu.`);
    } catch (error) {
      console.error(error);
      toast.error("Özellik oluşturulamadı.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const postData = {
        name,
        parentId: parentId === "" || parentId === "null" ? null : parentId,
        brandIds: selectedBrandIds,
        attributeIds: selectedAttributeIds,
      };

      if (initialData) {
        await axios.patch(`/api/categories/${params.categoryId}`, postData);
        toast.success("Kategori güncellendi.");
      } else {
        await axios.post(`/api/categories`, postData);
        toast.success("Kategori oluşturuldu.");
      }
      router.refresh();
      router.push(`/admin/categories`);
    } catch (error) {
      console.log(error);
      toast.error("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/admin/categories`);
      toast.success("Kategori silindi.");
    } catch (error) {
      console.log(error);
      toast.error("Silinemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between py-8">
        <div className="space-y-1">
          <Link
            href="/admin/categories"
            className="text-gray-500 text-sm flex items-center gap-1 hover:text-black transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Geri Dön
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h1>
        </div>
        {initialData && (
          <button
            disabled={loading}
            onClick={onDelete}
            type="button"
            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all text-sm font-bold flex items-center shadow-sm"
          >
            <Trash className="h-4 w-4 mr-2" /> Sil
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* GENEL BİLGİLER */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Tag size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Temel Bilgiler
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Kategori Adı
              </label>
              <input
                disabled={loading}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all"
                placeholder="Örn: Laptop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Üst Kategori
              </label>
              <div className="relative">
                <select
                  disabled={loading}
                  className="flex h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 outline-none cursor-pointer"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">-- Ana Kategori (Yok) --</option>
                  {categories
                    .filter((c) => c.id !== initialData?.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-3.5 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MARKALAR (Ekle Tuşlu) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Sparkles size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Marka Yönetimi
              </h3>
              <p className="text-xs text-gray-500">
                Ara veya yeni marka yazıp ekle.
              </p>
            </div>
          </div>
          <SearchableMultiSelect
            items={brandList}
            selectedIds={selectedBrandIds}
            onChange={setSelectedBrandIds}
            onCreate={handleCreateBrand}
            placeholder="Marka ara veya yaz..."
            colorTheme="indigo"
          />
        </div>

        {/* ÖZELLİKLER (Ekle Tuşlu) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Tag size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Filtre Özellikleri
              </h3>
              <p className="text-xs text-gray-500">
                Ara veya yeni özellik yazıp ekle.
              </p>
            </div>
          </div>
          <SearchableMultiSelect
            items={attributeList}
            selectedIds={selectedAttributeIds}
            onChange={setSelectedAttributeIds}
            onCreate={handleCreateAttribute}
            placeholder="Özellik ara veya yaz..."
            colorTheme="emerald"
          />
        </div>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            disabled={loading}
            type="submit"
            className="bg-gray-900 text-white px-8 py-3.5 rounded-xl hover:bg-black font-semibold shadow-xl shadow-gray-200 active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> {action}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- YARDIMCI BİLEŞEN: BUTONLU SEÇİM KUTUSU ---
interface SearchableMultiSelectProps {
  items: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreate?: (name: string) => Promise<void>;
  placeholder: string;
  colorTheme: "indigo" | "emerald";
}

const SearchableMultiSelect = ({
  items,
  selectedIds,
  onChange,
  onCreate,
  placeholder,
  colorTheme,
}: SearchableMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = {
    indigo: {
      ring: "focus:ring-indigo-500",
      btn: "bg-indigo-600 hover:bg-indigo-700",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    emerald: {
      ring: "focus:ring-emerald-500",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  }[colorTheme];

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.includes(item.id)
  );

  const handleSelect = (id: string) => {
    onChange([...selectedIds, id]);
    setQuery("");
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((currentId) => currentId !== id));
  };

  // --- İŞTE O EKLE TUŞU FONKSİYONU ---
  const handleManualAdd = async () => {
    if (!query.trim()) return;

    // 1. Listede var mı diye bak (Tam eşleşme)
    const existingItem = items.find(
      (i) => i.name.toLowerCase() === query.toLowerCase()
    );

    if (existingItem) {
      // Varsa ve seçili değilse seç
      if (!selectedIds.includes(existingItem.id)) {
        handleSelect(existingItem.id);
        toast.success("Listeden bulundu ve eklendi.");
      } else {
        toast.error("Zaten ekli.");
      }
    } else {
      // Yoksa oluştur
      if (onCreate) {
        setIsCreating(true);
        await onCreate(query);
        setIsCreating(false);
        setQuery("");
        setIsOpen(false);
      }
    }
  };

  // Enter'a basınca da eklesin (Opsiyonel ama kullanışlı)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualAdd();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* INPUT VE BUTTON YAN YANA */}
      <div className="flex gap-2 relative">
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-3.5 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 text-sm focus:outline-none focus:ring-2 ${theme.ring} focus:bg-white transition-all`}
          />

          {/* Dropdown Liste */}
          {isOpen && query.length > 0 && filteredItems.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <ul className="py-1 max-h-60 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between group hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                    <Plus
                      size={16}
                      className="opacity-0 group-hover:opacity-100 text-gray-400"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* --- İŞTE BU EKLE TUŞU --- */}
        <button
          type="button"
          onClick={handleManualAdd}
          disabled={!query.trim() || isCreating}
          className={`px-4 rounded-xl text-white font-medium shadow-sm transition-all active:scale-95 flex items-center gap-2 ${theme.btn} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isCreating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          <span className="hidden md:inline">Ekle</span>
        </button>
      </div>

      {/* Seçilen Etiketler */}
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/30">
        {selectedIds.length === 0 && (
          <span className="text-sm text-gray-400 italic py-1 ml-1 select-none">
            Seçim yapılmadı.
          </span>
        )}
        {selectedIds.map((id) => {
          const item = items.find((i) => i.id === id);
          if (!item) return null;
          return (
            <div
              key={id}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg border text-xs font-bold shadow-sm animate-in fade-in zoom-in duration-200 ${theme.badge}`}
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="p-0.5 rounded-md hover:bg-black/10 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
