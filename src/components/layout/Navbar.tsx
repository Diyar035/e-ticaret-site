<<<<<<< HEAD
"use client";

import useCart from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarCartActions() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Sunucuda render edilirken boş dön (Hata önleyici)
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Link
        href="/cart"
        className="flex items-center gap-x-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white p-2 px-4 rounded-full hover:opacity-75 transition"
      >
        <ShoppingBag size={20} />
        <span className="text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Link>
    </div>
=======
'use client';

import { useCart } from '@/context/cart';
import Link from 'next/link';

/**
 * Navbar Bileşeni
 *
 * Basit navigasyon bileşeni - logo ve sepet gösterimi
 * Sepet ürün sayısını context'ten alarak dinamik olarak gösterir
 */
export default function Navbar() {
  // Sepet context'inden toplam ürün adedini al
  const { totalItems } = useCart();

  return (
    <nav>
      {/* Ana sayfaya yönlendiren logo/link */}
      <Link href="/">KervanPazar</Link>

      {/* Sepet sayfasına yönlendiren link */}
      <Link href="/cart">
        {/* Sepet ikonu */}
        🛒
        {/* Sepette ürün varsa sayıyı göster */}
        {totalItems > 0 && <span>{totalItems}</span>}
      </Link>
    </nav>
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  );
}
