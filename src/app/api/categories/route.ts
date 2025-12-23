import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Terminale gelen veriyi yazdıralım (Hata ayıklamak için)
    console.log("GELEN VERİ:", body);

    const { name, parentId, brandIds, attributeIds } = body;

    if (!name) {
      return new NextResponse("Kategori ismi zorunludur", { status: 400 });
    }

    // 2. Slug Oluşturma (Benzersiz olması için kontrol ekledik)
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Aynı slug var mı diye kontrol et, varsa sonuna rastgele sayı ekle
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // 3. Veritabanına Kayıt
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        // parentId boş string veya "null" gelirse veritabanına null gönder
        parentId:
          parentId && parentId !== "null" && parentId !== "" ? parentId : null,

        // Markaları Bağla
        brands: {
          connect:
            Array.isArray(brandIds) && brandIds.length > 0
              ? brandIds.map((id: string) => ({ id }))
              : [],
        },

        // Özellikleri Bağla
        attributes: {
          connect:
            Array.isArray(attributeIds) && attributeIds.length > 0
              ? attributeIds.map((id: string) => ({ id }))
              : [],
        },
      },
    });

    console.log("BAŞARIYLA OLUŞTURULDU:", category);
    return NextResponse.json(category);
  } catch (error) {
    // 4. Gerçek hatayı terminale yaz
    console.log("[CATEGORIES_POST_ERROR]", error);
    return new NextResponse("Sunucu Hatası: Terminale bak", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        parent: true,
        brands: true,
        attributes: true,
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
