"use client";

<<<<<<< HEAD
=======
import CategoryHeader from "@/components/shared/CategoryHeader";
import { usePathname } from "next/navigation";
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
import { ReactNode } from "react";

/**
 * Sayfa Layout Bileşeni
 *
<<<<<<< HEAD
 * Sadece sayfa içeriğini merkeze alan ve padding veren basit bir wrapper.
 * Navbar kontrolü artık CategoryHeader'ın kendi içinde yapılıyor.
 */
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    // Ana İçerik Alanı - container ile merkezileştirilmiş
    <main className="flex-grow container mx-auto p-4 md:p-6 min-h-[60vh]">
      {children}
    </main>
=======
 * Sayfa içeriğini saran ana layout bileşeni.
 * Kategori header'ını koşullu olarak gösterir ve ana içeriği wrapper'lar.
 *
 * @param children - Sayfa içeriği olarak render edilecek React bileşenleri
 */
export function PageLayout({ children }: { children: ReactNode }) {
  // Mevcut sayfa yolunu al
  const pathname = usePathname();

  // Kategori header'ının gizleneceği sayfa yolları
  const hideCategoryHeaderOn = [
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/privacy-policy",
    "/cookies",
    "/returns",
    "/shipping-returns",
    "/cart", // Sepet sayfası
    "/about", // Hakkımızda sayfası
  ];

  // Kategori header'ının gösterilip gösterilmeyeceğini belirle
  const shouldShowCategoryHeader = !hideCategoryHeaderOn.includes(pathname);

  return (
    <>
      {/* Koşullu Kategori Header - belirli sayfalarda gizlenir */}
      {shouldShowCategoryHeader && <CategoryHeader />}

      {/* Ana İçerik Alanı - container ile merkezileştirilmiş */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  );
}
