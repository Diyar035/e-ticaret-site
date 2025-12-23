import { prisma } from "@/lib/prisma-client";
import { NextResponse } from "next/server";

// 1. SİLME İŞLEMİ (KALICI SİLME)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Ürün kalıcı olarak silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}

// 2. GÜNCELLEME İŞLEMİ (ARŞİVLEME / GERİ YÜKLEME)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json(); // Frontend'den { isActive: false } gelecek

    await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
    });

    return NextResponse.json({ message: "Ürün durumu güncellendi" });
  } catch (error) {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}