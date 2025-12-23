import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  /* config options here */
=======
  // Resim Güvenlik Ayarı:
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
  images: {
    remotePatterns: [
      {
        protocol: "https",
<<<<<<< HEAD
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google login resimleri için lazım olabilir
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Placeholder kullanıyorsan
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Varsayılan 1mb'dır, 10mb yaptık
    },
  },
};

export default nextConfig;
=======
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
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
