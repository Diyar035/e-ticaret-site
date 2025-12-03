import Header from "@/components/layout/Header";
// Menü bileşenin adı neyse onu çağır (Navbar, Categories vs.)
// Dosya ismini hatırlamıyorsan components/layout klasörüne bak
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Üst Logo/Arama Kısmı */}
      <Header />

      {/* 2. O Kaybolan Menü Şeridi (Elektronik vs.) */}
      <Navbar />

      {/* 3. Sayfa İçeriği (Ana Sayfa Ürünleri buraya gelecek) */}
      <main className="flex-grow bg-gray-50">{children}</main>

      {/* Footer varsa buraya ekle */}
      {/* <Footer /> */}
    </div>
  );
}
