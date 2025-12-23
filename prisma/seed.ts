<<<<<<< HEAD
// prisma/seed.ts
// Veritabanı seed (tohumlama) dosyası - Başlangıç verilerini oluşturur

import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

// Prisma Client instance'ı oluştur
const prisma = new PrismaClient();

// Ana seed fonksiyonu
async function main() {
  // Güvenli bir şifre belirleyip hash'liyoruz
  // 'admin12345' şifresini 12 round ile hash'liyoruz
  const password = await hash("admin12345", 12);

  // Veritabanında admin kullanıcısı var mı diye kontrol edip, yoksa oluşturuyoruz
  // upsert metodu: eğer kullanıcı varsa günceller, yoksa oluşturur
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kervanpazar.com" }, // Benzersiz email ile kontrol
    update: {}, // Eğer kullanıcı varsa, herhangi bir güncelleme yapma (boş bırak)
    create: {
      email: "admin@kervanpazar.com", // Admin email adresi
      firstName: "Admin", // Admin kullanıcı adı
      passwordHash: password, // Hash'lenmiş şifre
      role: Role.ADMIN, // Rolünü ADMIN olarak atıyoruz
    },
  });

  console.log("Admin user has been created successfully:", adminUser);
}

// Seed işlemini başlat
main()
  .catch((e) => {
    // Hata durumunda logla ve process'i sonlandır
    console.error("Seed işlemi sırasında hata oluştu:", e);
    process.exit(1); // Hata kodu 1 ile çık
  })
  .finally(async () => {
    // İşlem tamamlandığında Prisma bağlantısını kapat
    await prisma.$disconnect();
  });
=======
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Senin verdiğin mockCategories verisi (Veritabanına bu işlenecek)
// NOT: Buradaki 'id' alanlarını veritabanındaki 'slug' alanına eşleştireceğiz.
const categoriesData = [
  {
    id: 'elektronik',
    name: 'Elektronik',
    subCategories: [
      { id: 'telefon', name: 'Cep Telefonları' },
      { id: 'bilgisayar', name: 'Laptop & Masaüstü' },
      { id: 'tv_ses', name: 'Televizyon & Ses Sistemleri' },
      { id: 'kamera', name: 'Kamera & Fotoğraf' },
    ],
  },
  {
    id: 'giyim',
    name: 'Giyim & Moda',
    subCategories: [
      { id: 'kadin_giyim', name: 'Kadın Giyim' },
      { id: 'erkek_giyim', name: 'Erkek Giyim' },
      { id: 'ayakkabi', name: 'Ayakkabı & Çanta' },
      { id: 'saat_aksesuar', name: 'Saat & Aksesuar' },
    ],
  },
  {
    id: 'ev_yasam',
    name: 'Ev, Yaşam & Ofis',
    subCategories: [
      { id: 'ev_dekorasyon', name: 'Ev Dekorasyon' },
      { id: 'mutfak_gerecleri', name: 'Mutfak Gereçleri' },
      { id: 'ev_tekstili', name: 'Ev Tekstili' },
      { id: 'ofis_kirtasiye', name: 'Ofis & Kırtasiye' },
    ],
  },
  {
    id: 'anne_bebek',
    name: 'Anne, Bebek & Oyuncak',
    subCategories: [
      { id: 'bebek_giyim', name: 'Bebek Giyim' },
      { id: 'bebek_bakim', name: 'Bebek Bakım & Sağlık' },
      { id: 'bebek_beslenme', name: 'Bebek Beslenme Gereçleri' },
      { id: 'bebek_guvenlik', name: 'Bebek Güvenlik Ürünleri' },
    ],
  },
  {
    id: 'kozmetik',
    name: 'Kozmetik & Kişisel Bakım',
    subCategories: [
      { id: 'makyaj', name: 'Makyaj Malzemeleri' },
      { id: 'cilt_bakim', name: 'Cilt Bakımı' },
      { id: 'sac_bakim', name: 'Saç Bakımı' },
      { id: 'parfum_deodorant', name: 'Parfüm & Deodorant' },
    ],
  },
  {
    id: 'oto_yapi_market',
    name: 'Oto, Bahçe & Yapı Market',
    subCategories: [
      { id: 'oto_aksesuar', name: 'Oto Aksesuarları' },
      { id: 'bahce_cicek', name: 'Bahçe & Çiçek' },
      { id: 'el_aletleri', name: 'El Aletleri' },
      { id: 'yapi_market', name: 'Yapı Market & Hırdavat' },
    ],
  },
  {
    id: 'spor_outdoor',
    name: 'Spor & Outdoor',
    subCategories: [
      { id: 'fitness_kondisyon', name: 'Fitness & Kondisyon' },
      { id: 'outdoor_kamp', name: 'Outdoor & Kamp' },
      { id: 'spor_giyim', name: 'Spor Giyim & Ayakkabı' },
      { id: 'takim_sporlari', name: 'Takım Sporları' },
    ],
  },
  {
    id: 'petshop',
    name: 'Pet Shop',
    subCategories: [
      { id: 'kedi_urunleri', name: 'Kedi Maması & Malzemeleri' },
      { id: 'kopek_urunleri', name: 'Köpek Maması & Malzemeleri' },
      { id: 'kus_balik_diger', name: 'Kuş, Balık & Diğer Evciller' },
      { id: 'pet_oyuncaklari', name: 'Pet Oyuncakları & Aksesuarları' },
    ],
  },
  {
    id: 'kitap_film_hobi',
    name: 'Kitap, Film, Müzik, Hobi',
    subCategories: [
      { id: 'kitaplar', name: 'Kitaplar & Dergiler' },
      { id: 'muzik_albumleri', name: 'Müzik Albümleri & Plaklar' },
      { id: 'filmler', name: 'Filmler (DVD, Blu-ray)' },
      { id: 'sanat_malzemeleri', name: 'Sanat & Hobi Malzemeleri' },
    ],
  },
  {
    id: 'mobilya',
    name: 'Mobilya',
    subCategories: [
      { id: 'oturma_odasi', name: 'Oturma Odası Mobilyaları' },
      { id: 'yatak_odasi', name: 'Yatak Odası Mobilyaları' },
      { id: 'ofis_mobilya', name: 'Ofis Mobilyaları' },
      { id: 'bahce_mobilya', name: 'Bahçe Mobilyaları' },
    ],
  },
  {
    id: 'mucevher_saat',
    name: 'Mücevher & Saat',
    subCategories: [
      { id: 'kadin_saat', name: 'Kadın Kol Saatleri' },
      { id: 'erkek_saat', name: 'Erkek Kol Saatleri' },
      { id: 'taki_mucevher', name: 'Takı & Mücevher' },
      { id: 'aksesuarlar', name: 'Güneş Gözlüğü & Aksesuar' },
    ],
  },
  {
    id: 'oyuncak_oyun',
    name: 'Oyuncak & Oyun',
    subCategories: [
      { id: 'bebek_oyuncak', name: 'Bebek & Okul Öncesi Oyuncaklar' },
      { id: 'kutu_oyunlari_puzzle', name: 'Kutu Oyunları & Puzzle' },
      { id: 'dis_mekan_oyuncak', name: 'Dış Mekan & Spor Oyuncakları' },
      { id: 'figur_oyuncak', name: 'Figür Oyuncaklar & Koleksiyon' },
    ],
  },
  {
    id: 'saglik_wellness',
    name: 'Sağlık & Wellness',
    subCategories: [
      { id: 'vitamin_takviye', name: 'Vitamin & Besin Takviyeleri' },
      { id: 'sporcu_besinleri', name: 'Sporcu Besinleri' },
      { id: 'medikal_urunler', name: 'Medikal Ürünler & Cihazlar' },
      { id: 'kisisel_bakim_cihazlari', name: 'Kişisel Bakım Cihazları' },
    ],
  },
  {
    id: 'seyahat',
    name: 'Valiz & Seyahat',
    subCategories: [
      { id: 'valiz_bavul', name: 'Valiz & Bavul Setleri' },
      { id: 'sirt_cantasi', name: 'Sırt Çantaları' },
      { id: 'seyahat_aksesuar', name: 'Seyahat Aksesuarları' },
      { id: 'cocuk_valiz', name: 'Çocuk Valiz ve Çantaları' },
    ],
  },
  {
    id: 'supermarket',
    name: 'Süpermarket',
    subCategories: [
      { id: 'temel_gida', name: 'Temel Gıda & Bakliyat' },
      { id: 'icecekler', name: 'İçecekler' },
      { id: 'ev_temizlik', name: 'Ev Temizlik Ürünleri' },
      { id: 'atistirmaliklar', name: 'Atıştırmalık & Şekerleme' },
    ],
  },
]

async function main() {
  console.log('🚀 Seed işlemi başladı...')

  // --- 1. ADMIN KULLANICISI OLUŞTURMA ---
  const adminEmail = 'admin@kervanpazar.com'
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, 
    create: {
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      // Şifre: password123 (hashlenmiş)
      passwordHash: '$2b$12$LelALIpqHPi8FAdOax8vOuLFl1vTtsIoz24XX0Atqdzpo/4XP9go6', 
    },
  })
  console.log('👤 Admin kullanıcısı hazır.')


  // --- 2. KATEGORİLERİ İŞLEME ---
  for (const cat of categoriesData) {
    
    // A) Ana Kategoriyi Oluştur
    // Burada Mock Data'daki 'id' alanını veritabanındaki 'slug' alanına kaydediyoruz.
    const parentCategory = await prisma.category.upsert({
      where: { slug: cat.id }, // slug benzersiz olduğu için buradan kontrol ediyoruz
      update: {},
      create: {
        name: cat.name,
        slug: cat.id, // Örn: 'elektronik'
        // parentId yok
      }
    })

    console.log(`📦 Ana Kategori: ${parentCategory.name}`)

    // B) Alt Kategorileri Oluştur
    if (cat.subCategories && cat.subCategories.length > 0) {
      for (const sub of cat.subCategories) {
        
        await prisma.category.upsert({
          where: { slug: sub.id },
          update: {},
          create: {
            name: sub.name,
            slug: sub.id, // Örn: 'kadin_giyim'
            parentId: parentCategory.id // Ana kategoriye bağlıyoruz
          }
        })
      }
    }
  }

  console.log('✅ Tüm kategoriler Frontend verisiyle birebir yüklendi!')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
