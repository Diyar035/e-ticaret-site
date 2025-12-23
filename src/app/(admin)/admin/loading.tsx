export default function AdminGlobalLoading() {
  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen space-y-8 animate-pulse">
      {/* --- 1. BAŞLIK VE AÇIKLAMA SKELETON --- */}
      <div className="flex flex-col gap-3">
        <div className="h-10 w-48 bg-gray-200 rounded-xl shadow-sm" />{" "}
        {/* Başlık */}
        <div className="h-5 w-80 bg-gray-100 rounded-lg" /> {/* Açıklama */}
      </div>

      {/* --- 2. ÜST KARTLAR (DASHBOARD & İSTATİSTİK İÇİN) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-gray-100 rounded-xl" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-100 rounded-lg" />
              <div className="h-8 w-32 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* --- 3. İÇERİK ALANI (TABLO VEYA GENİŞ KARTLAR İÇİN) --- */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden min-h-[500px] p-6">
        {/* Toolbar benzeri üst kısım */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="h-12 w-full md:w-1/3 bg-gray-50 rounded-2xl" />
          <div className="flex gap-3">
            <div className="h-12 w-24 bg-gray-50 rounded-2xl" />
            <div className="h-12 w-24 bg-gray-50 rounded-2xl" />
          </div>
        </div>

        {/* Satırlar (Tablo hissi veren çizgiler) */}
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-4 w-3/4 bg-gray-50 rounded-lg" />
                <div className="h-3 w-1/2 bg-gray-50 rounded-lg" />
              </div>
              <div className="w-20 h-8 bg-gray-50 rounded-lg shrink-0 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
