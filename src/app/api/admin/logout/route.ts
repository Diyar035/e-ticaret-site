<<<<<<< HEAD
import { NextResponse } from "next/server";
=======
import { NextResponse } from 'next/server';
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65

/**
 * Çıkış API Route'u
 *
 * Admin kullanıcısının güvenli çıkış işlemini yönetir.
 * Cookie'leri temizleyerek oturumu sonlandırır.
 */
export async function POST() {
  try {
    // Başarılı yanıt oluştur
    const response = NextResponse.json(
<<<<<<< HEAD
      { message: "çıkış başarılı" }, // Başarı mesajı
=======
      { message: 'çıkış başarılı' }, // Başarı mesajı
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      { status: 200 } // HTTP 200 OK
    );

    /**
     * Admin Token Cookie'sini Temizle
     * - httpOnly: XSS saldırılarına karşı koruma
     * - secure: Production'da HTTPS gerektirir
     * - sameSite: CSRF saldırılarına karşı koruma
     * - maxAge: 0 - cookie'yi hemen sonlandır
     * - path: Sadece /admin/login path'inde geçerli
     */
<<<<<<< HEAD
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/admin/login",
=======
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin/login',
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
    });

    /**
     * Admin Session Cookie'sini Temizle
     * Aynı güvenlik ayarları ile ikinci cookie'yi de temizle
     */
<<<<<<< HEAD
    response.cookies.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/admin/login",
=======
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin/login',
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
    });

    return response;
  } catch (error) {
    // Hata durumunda 500 Internal Server Error döndür
    return NextResponse.json(
<<<<<<< HEAD
      { error: "çıkış sırasında bir hata oluştu" },
=======
      { error: 'çıkış sırasında bir hata oluştu' },
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      { status: 500 }
    );
  }
}
