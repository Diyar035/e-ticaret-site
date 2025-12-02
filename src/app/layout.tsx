import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // <-- YENİ EKLENDİ

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Ticaret Admin",
  description: "Yönetim Paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* BÜTÜN UYGULAMAYI SARIYORUZ */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
