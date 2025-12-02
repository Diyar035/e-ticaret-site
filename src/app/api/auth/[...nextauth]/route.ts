import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Bu paket yüklü olmalı
import { prisma } from "@/lib/prisma-client";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// ... diğer importlar

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // <-- BU ÇOK ÖNEMLİ! Prisma ile bağlıyor.

  session: {
    strategy: "jwt", // JWT kullanmak genelde daha az baş ağrıtır ve hızlıdır.
    // Eğer veritabanında 'Session' tablosunu zorunlu kullanacaksan "database" yapabilirsin
    // ama "jwt" yaparsan sayfa geçişlerinde veritabanını yormaz, atma sorunu azalır.
  },

  providers: [
    // Senin Credentials (Email/Şifre) ayarların burada...
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        // Token'daki ID'yi session'a ekle ki kaybolmasın
        session.user.id = token.sub as string;
        // Rolü de ekleyebilirsin
        // session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // token.role = user.role;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // .env dosyasındaki o gizli şifre
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
