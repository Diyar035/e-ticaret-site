<<<<<<< HEAD
"use client";

import {
  ChevronRight,
  FolderTree,
=======
'use client';

import {
  ChevronRight,
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
<<<<<<< HEAD
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    pendingOrders: number;
    lowStockProducts: number;
    totalUsers: number;
    totalAdmins: number;
    totalCategories: number;
  };
}

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  stats,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems: MenuItem[] = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Siparişler",
      badge: stats.pendingOrders,
    },
    {
      href: "/admin/products",
      icon: Package,
      label: "Ürünler",
      badge: stats.lowStockProducts,
    },
    {
      href: "/admin/categories",
      icon: FolderTree,
      label: "Kategoriler",
      badge: stats.totalCategories,
    },
    {
      href: "/admin/customers",
      icon: Users,
      label: "Müşteriler",
      badge: stats.totalUsers,
    },
    {
      href: "/admin/administrators",
      icon: Users,
      label: "Yöneticiler",
      badge: stats.totalAdmins,
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Ayarlar",
    },
    {
      href: "/admin/logs",
      icon: Settings,
      label: "Loglar",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/admin/login" });
    } catch (error) {
      console.error("Logout error:", error);
=======
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Props interface'i - admin sidebar bileşeninin alacağı props'lar
interface AdminSidebarProps {
  isOpen: boolean; // Sidebar'ın açık/kapalı durumu
  onClose: () => void; // Sidebar'ı kapatma fonksiyonu
}

// Menü öğeleri için interface
interface MenuItem {
  href: string; // Yönlendirme linki
  icon: React.ComponentType<{ className?: string }>; // Lucide React ikonu
  label: string; // Menü öğesi etiketi
  badge?: number; // Opsiyonel: bildirim sayısı
}

/**
 * Admin menü öğeleri dizisi
 * Dashboard, siparişler, ürünler, kullanıcılar ve ayarlar bölümleri
 */
const menuItems: MenuItem[] = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    badge: 3, // Bekleyen işlem sayısı
  },
  { 
    href: '/admin/orders', 
    icon: ShoppingCart, 
    label: 'Siparişler', 
    badge: 12 // Yeni sipariş sayısı
  },
  { 
    href: '/admin/products', 
    icon: Package, 
    label: 'Ürünler', 
    badge: 5 // Düzenlenecek ürün sayısı
  },
  { 
    href: '/admin/users', 
    icon: Users, 
    label: 'Kullanıcılar', 
    badge: 8 // Yeni kullanıcı sayısı
  },
  { 
    href: '/admin/settings', 
    icon: Settings, 
    label: 'Ayarlar' 
    // Ayarlar için badge yok
  },
];

/**
 * Admin Sidebar Bileşeni
 * 
 * Admin paneli için yönlendirme menüsü.
 * Collapsible sidebar özelliği ile desktop'ta hover ile genişler.
 * Mobile'da slide-in menü olarak çalışır.
 */
export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  // Mevcut sayfa yolunu al
  const pathname = usePathname();
  // Desktop'ta hover durumunu takip et
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Çıkış yapma fonksiyonu
   * NextAuth signOut ile kullanıcı oturumunu sonlandırır
   */
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin/login' });
    } catch (error) {
      console.error('Logout error:', error);
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
    }
  };

  return (
    <>
<<<<<<< HEAD
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
=======
      {/* ✅ Mobile Overlay - sidebar açıkken arkaplan karartması */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
          onClick={onClose}
          aria-hidden="true"
        />
      )}

<<<<<<< HEAD
      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#111827] text-white 
          transform transition-all duration-300 ease-in-out lg:static
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:translate-x-0"}
          ${isHovered ? "lg:w-72" : "lg:w-20"}
          border-r border-gray-800 shadow-2xl flex flex-col
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* --- HEADER (LOGO) --- */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800 flex-shrink-0">
          {/* Logo Container - Animasyonlu */}
          <div
            className={`flex items-center transition-all duration-300 ${isHovered ? "w-full px-2" : "w-full justify-center"}`}
          >
            <div
              className={`relative h-10 flex-shrink-0 transition-all duration-300 overflow-hidden ${isHovered ? "w-48" : "w-10"}`}
            >
              {/* Logo Resmi */}
              <Image
                src="/kervanpazar-logo.png"
                alt="Logo"
                fill
                className={`object-contain transition-all duration-300 ${isHovered ? "object-left" : "object-left"}`}
                // Not: Kapalıyken (w-10) object-left diyerek logonun sadece baş kısmını (ikonunu) gösteriyoruz.
                priority
              />
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- NAVİGASYON --- */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      group relative flex items-center px-3 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    {/* İkon */}
                    <div
                      className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Metin (Animasyonlu) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
                      ${isHovered ? "w-40 ml-3 opacity-100" : "w-0 ml-0 opacity-0 lg:w-0"}`}
                    >
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>

                    {/* Badge (Sayı) */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <div
                        className={`
                        absolute right-2 transition-all duration-300
                        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 lg:hidden"}
                      `}
                      >
                        <span
                          className={`
                           px-2 py-0.5 text-[10px] font-bold rounded-full
                           ${isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"}
                         `}
                        >
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {/* Kapalıyken çıkan küçük nokta badge */}
                    {!isHovered &&
                      item.badge !== undefined &&
                      item.badge > 0 && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full lg:block hidden"></div>
                      )}

                    {/* Tooltip (Sadece kapalıyken) */}
                    <div
                      className={`
                      absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-xl 
                      opacity-0 invisible -translate-x-2 transition-all z-50 whitespace-nowrap border border-gray-700
                      lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-x-0
                      ${isHovered ? "hidden" : "block"}
                    `}
                    >
                      {item.label}
                      {item.badge ? ` (${item.badge})` : ""}
                      {/* Tooltip Oku */}
                      <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 transform rotate-45"></div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --- FOOTER (ÇIKIŞ) --- */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group
            `}
          >
            <div className="flex-shrink-0">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
                ${isHovered ? "w-40 ml-3 opacity-100" : "w-0 ml-0 opacity-0 lg:w-0"}`}
            >
              <span className="font-medium text-sm">Çıkış Yap</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
=======
      {/* ✅ Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isHovered ? 'lg:w-80' : 'lg:w-20'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
        aria-label="Admin menüsü"
      >
        <div className="flex flex-col h-full">
          {/* ✅ Header - Logo ve Kapatma Butonu */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${!isHovered && 'lg:justify-center'}`}
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/kervanpazar-logo.png"
                  alt="KervanPazar Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Logo yanında marka adı - sadece geniş modda görünür */}
              <span className={`font-bold text-lg transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}>
                KervanPazar
              </span>
            </div>

            {/* Mobile Kapatma Butonu - sadece mobilde görünür */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Menüyü kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ Navigasyon Menüsü */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                // Mevcut sayfa aktif menü öğesi mi kontrol et
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border-r-4 border-blue-500 shadow-lg' // Aktif menü stili
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white' // Normal menü stili
                      }
                      ${!isHovered && 'lg:justify-center lg:px-3'} // Dar modda içeriği ortala
                    `}
                    onClick={onClose} // Mobile'da tıklamada menüyü kapat
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      {/* Menü İkonu */}
                      <div
                        className={`
                        p-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-blue-500 text-white' // Aktif ikon stili
                            : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600' // Normal ikon stili
                        }
                      `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {/* Menü Etiketi - sadece geniş modda görünür */}
                      <span
                        className={`font-medium transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Badge ve Ok İkonu - bildirim sayısı varsa göster */}
                    {item.badge && (
                      <div
                        className={`
                        flex items-center gap-2 transition-all duration-300
                        ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}
                      `}
                      >
                        {/* Bildirim Badge'i */}
                        <span
                          className={`
                          px-2 py-1 text-xs rounded-full font-medium
                          ${
                            isActive
                              ? 'bg-blue-500 text-white' // Aktif badge stili
                              : 'bg-gray-700 text-gray-300' // Normal badge stili
                          }
                        `}
                        >
                          {item.badge}
                        </span>
                        {/* Yön oku - aktif menüde döner */}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`}
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ✅ Çıkış Butonu - sidebar'ın alt kısmında */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 group
                ${!isHovered && 'lg:justify-center lg:px-3'} // Dar modda içeriği ortala
              `}
              aria-label="Çıkış yap"
            >
              {/* Çıkış İkonu */}
              <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-red-500/30 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              {/* Çıkış Metni - sadece geniş modda görünür */}
              <span
                className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}
              >
                Çıkış Yap
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
