"use client";

import { SessionProvider } from "next-auth/react";
// Sepet context yolunu kontrol et
import { CartProvider } from "@/context/cart/index";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
