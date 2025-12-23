import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

interface Params {
  params: Promise<{ categoryId: string }>;
}

// GET: Tek bir kategoriyi getir (Düzenleme sayfası için)
export async function GET(req: Request, { params }: Params) {
  try {
    const { categoryId } = await params;

    if (!categoryId) return new NextResponse("ID gerekli", { status: 400 });

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        brands: true,
        attributes: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH: Kategoriyi Güncelle
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { categoryId } = await params;
    const body = await req.json();
    const { name, parentId, brandIds, attributeIds } = body;

    if (!categoryId) return new NextResponse("ID gerekli", { status: 400 });
    if (!name) return new NextResponse("İsim gerekli", { status: 400 });

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        parentId: parentId && parentId !== "null" ? parentId : null,

        // Markaları güncelle (Eskileri çıkarıp yenileri set eder)
        brands: {
          set: brandIds?.map((id: string) => ({ id })) || [],
        },

        // Özellikleri güncelle
        attributes: {
          set: attributeIds?.map((id: string) => ({ id })) || [],
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Kategoriyi Sil
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { categoryId } = await params;

    if (!categoryId) return new NextResponse("ID gerekli", { status: 400 });

    const category = await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
