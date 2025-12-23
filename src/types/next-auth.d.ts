<<<<<<< HEAD
// lib/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Kendi enum'umuzu import ediyoruz
import { Role } from "@prisma/client";

// 1. JWT (Token) tipini genişletiyoruz
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role; // Token'ımıza 'role' alanını ekliyoruz
    id: string; // Token'ımıza 'id' alanını ekliyoruz
    firstName?: string;
    lastName?: string;
=======
// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// Kendi enum'umuzu import ediyoruz
import { Role } from '@prisma/client';

// 1. JWT (Token) tipini genişletiyoruz
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: Role; // Token'ımıza 'role' alanını ekliyoruz
    id: string; // Token'ımıza 'id' alanını ekliyoruz
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  }
}

// 2. Session tipini genişletiyoruz
<<<<<<< HEAD
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      firstName?: string;
      lastName?: string;
      // Session.user objesine 'role' ve 'id' alanlarını ekliyoruz
    } & DefaultSession["user"]; // Orijinal user alanlarını (name, email, image) koruyoruz
=======
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role; // Session.user objesine 'role' ve 'id' alanlarını ekliyoruz
    } & DefaultSession['user']; // Orijinal user alanlarını (name, email, image) koruyoruz
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  }

  // 3. authorize'dan dönen User tipini genişletiyoruz
  interface User extends DefaultUser {
    role: Role; // User objemize 'role' alanını ekliyoruz
<<<<<<< HEAD
    firstName?: string;
    lastName?: string;
=======
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  }
}
