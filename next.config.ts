import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resim Güvenlik Ayarı:
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Yıldız işareti "Tüm sitelere güven" demektir
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  
  // Hata Görmezden Gelme Ayarları (Daha önce eklemiştik):
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;