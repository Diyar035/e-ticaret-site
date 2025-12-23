// Dosya: src/components/layout/MobileMenu.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
// DÜZELTME: SideMenu senin dediğin klasörden çağrılıyor
import { SideMenu } from "./category-nav/SideMenu";

interface MobileMenuProps {
  categories: any[];
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 md:hidden"
        // md:hidden ekledim ki masaüstünde boşuna çıkmasın, sadece mobilde görünsün
        aria-label="Menüyü aç"
      >
        <Menu size={24} />
      </button>

      <SideMenu
        categories={categories}
        isMenuOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
