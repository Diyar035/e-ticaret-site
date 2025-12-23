<<<<<<< HEAD
// src/app/layout.tsx
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AuthProvider from "@/components/shared/AuthProvider";
import { BackToTopButton } from "@/components/shared/BackToTopButton";
import type { Metadata } from "next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "İpek Yolu'nun Dijital Hali",
  description: "İpek Yolu'nun Dijital Hali",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body id="top" className={`${geist.variable}`}>
        <AuthProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              success: {
                style: {
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                },
              },
            }}
          />
          <BackToTopButton />
=======
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
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
        </AuthProvider>
      </body>
    </html>
  );
}
