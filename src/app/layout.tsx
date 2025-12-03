import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// PROVIDER'LAR
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/context/cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Ticaret",
  description: "Alışverişin Adresi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* Burası tüm uygulamanın ana kapsayıcısı */}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
