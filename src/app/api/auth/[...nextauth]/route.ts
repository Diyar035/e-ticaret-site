<<<<<<< HEAD
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma-client";

/**
 * NextAuth Yapılandırma Seçenekleri
 *
 * Kimlik doğrulama sistemi için gerekli ayarlar ve provider'lar
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" }, // Email alanı
        password: { label: "Password", type: "password" }, // Şifre alanı
      },
      // Kullanıcı doğrulama fonksiyonu
      async authorize(credentials) {
        // Email ve şifre kontrolü
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Veritabanından kullanıcıyı bul
=======
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma-client";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gerekli");
        }

>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

<<<<<<< HEAD
        // Kullanıcı veya şifre hash'i yoksa
        if (!user || !user.passwordHash) {
          return null; // Yetkilendirme başarısız
        }

        // Şifre doğrulama - bcrypt ile hash karşılaştırma
        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        );

        // Şifre yanlışsa
        if (!isPasswordValid) {
          return null; // Yetkilendirme başarısız
        }

        // Başarılı giriş - kullanıcı bilgilerini döndür
        return {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
          role: user.role,
        };
      },
    }),
  ],
  // Auth callback'leri - token ve session özelleştirme
  callbacks: {
    // JWT token callback - token oluşturulurken/güncellenirken
    async jwt({ token, user }) {
      // İlk girişte kullanıcı bilgilerini token'a ekle
      if (user) {
        token.id = user.id; // Kullanıcı ID'si
        token.role = user.role; // Kullanıcı rolü
      }
      return token;
    },
    // Session callback - session oluşturulurken
    async session({ session, token }) {
      // Token'daki bilgileri session'a ekle
      if (session.user) {
        session.user.id = token.id; // Kullanıcı ID'si
        session.user.role = token.role; // Kullanıcı rolü
=======
        if (!user || !user.passwordHash) {
          throw new Error("Kullanıcı bulunamadı!");
        }

        const isPasswordValid = credentials.password === user.passwordHash;

        if (!isPasswordValid) {
          throw new Error("Şifre Hatalı!");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // ESLint'i susturuyoruz:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.id = token.id as any;

        // ESLint'i susturuyoruz:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = token.role as any;
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      }
      return session;
    },
  },
<<<<<<< HEAD
};
=======
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
};

>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
