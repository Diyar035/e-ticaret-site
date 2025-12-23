// src/app/(auth)/login/page.tsx
<<<<<<< HEAD
"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🟢 ZOD VE HOOK FORM IMPORTS
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🟢 1. ŞEMA TANIMI
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz."),
});

// Şemadan tip türetme
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI State'leri
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // 🟢 2. REACT HOOK FORM KURULUMU
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // URL'den gelen hataları yakala (NextAuth redirect hataları)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setGlobalError("Geçersiz e-posta veya şifre.");
    }
  }, [searchParams]);

  // 🟢 3. SUBMIT FONKSİYONU
  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(""); // Önceki hataları temizle

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        loginType: "USER", // Müşteri girişi
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setGlobalError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      {/* Başlık */}
=======
'use client';

import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function LoginPage() {
  // ... (Tüm state'ler ve logic'ler (useState, useEffect, handleSubmit) aynı kalıyor)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'CredentialsSignin') {
      setError('Geçersiz parola veya şifre.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password: password,
        redirect: false,
      });
      if (result?.error) {
        setError('Geçersiz e-posta veya şifre.');
        setIsLoading(false);
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  // --- RETURN KISMI SADELEŞTİ ---
  // Dıştaki wrapper'lar (min-h-screen, max-w-md) ve footer
  // layout'tan geldiği için kaldırıldı.
  return (
    <>
      {/* Sayfaya özel başlık (Logo layout'tan geliyor) */}
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Tekrar Hoş Geldiniz!
        </h2>
        <p className="text-gray-600 mt-2">
          Hesabınıza giriş yapın ve alışverişe devam edin.
        </p>
      </div>

      {/* Giriş Kartı */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
<<<<<<< HEAD
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Global Hata Mesajı */}
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {globalError}
            </div>
          )}

          {/* EMAIL ALANI */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
=======
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email Alanı */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
              E-posta Adresi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
<<<<<<< HEAD
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("email")}
                type="email"
                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white 
                  ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300 focus:border-[#667EEA] focus:ring-indigo-100"
                  }`}
                placeholder="ornek@mail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ŞİFRE ALANI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-900">
=======
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="examle@mail.com"
                required
              />
            </div>
          </div>

          {/* Şifre Alanı */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900"
              >
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
                Şifre
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
<<<<<<< HEAD
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white
                  ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300 focus:border-[#667EEA] focus:ring-indigo-100"
                  }`}
                placeholder="••••••••"
=======
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="••••••••"
                required
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
<<<<<<< HEAD
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
=======
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
<<<<<<< HEAD
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            {isSubmitting ? (
=======
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group"
          >
            {isLoading ? (
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Giriş Yapılıyor...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Giriş Yap</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        {/* Kayıt Sayfasına Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
<<<<<<< HEAD
            Henüz bir hesabın yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-[#667EEA] hover:text-[#5a6fd6] underline-offset-4 hover:underline transition-colors"
=======
            Henüz bir hesabın yok mu?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
            >
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
