<<<<<<< HEAD
import type { Role } from "@prisma/client";
import type { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
=======
import type { Role } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65

// Next.js middleware fonksiyonu - her request'ten önce çalışır
export default withAuth(
  function middleware(req) {
<<<<<<< HEAD
    const token = req.nextauth.token as (JWT & { role: Role }) | null;
    const isAdmin = token?.role === "ADMIN";

    // ✅ ADMIN ROUTE KONTROLÜ - /admin ile başlayan tüm route'lar
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Token yoksa (kullanıcı giriş yapmamışsa) login sayfasına yönlendir
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
=======
    // Token'dan kullanıcı rolünü al (type assertion ile)
    const token = req.nextauth.token as (JWT & { role: Role }) | null;
    // Kullanıcının ADMIN rolüne sahip olup olmadığını kontrol et
    const isAdmin = token?.role === 'ADMIN';

    // ✅ ADMIN ROUTE KONTROLÜ - /admin ile başlayan tüm route'lar
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Token yoksa (kullanıcı giriş yapmamışsa) login sayfasına yönlendir
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      }

      // Kullanıcı ADMIN değilse yetkisiz sayfasına yönlendir
      if (!isAdmin) {
<<<<<<< HEAD
        return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
=======
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      }
    }

    // Tüm kontroller başarılıysa request'i devam ettir
    return NextResponse.next();
  },
  {
    // Yetkilendirme callback'i - withAuth için gerekli
    callbacks: {
      authorized: ({ token, req }) => {
        // ✅ ADMIN ROUTE YETKİLENDİRMESİ
<<<<<<< HEAD
        if (req.nextUrl.pathname.startsWith("/admin")) {
=======
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Admin route'ları için token varlığını kontrol et (giriş yapılmış mı?)
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
          return !!token;
        }
        // Diğer tüm route'lar için erişime izin ver
        return true;
      },
    },
  }
);

// Middleware'in çalışacağı route pattern'larını belirle
export const config = {
  matcher: [
<<<<<<< HEAD
    "/admin/:path*", // ✅ /admin ve altındaki tüm route'lar
    "/user/profile:path*",
    "/user/orders:path*",
    "/api/admin/:path*", // ✅ /api/admin ve altındaki tüm API route'ları
=======
    '/admin/:path*', // ✅ /admin ve altındaki tüm route'lar
    '/api/admin/:path*', // ✅ /api/admin ve altındaki tüm API route'ları
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  ],
};
