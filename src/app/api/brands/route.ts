import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("İsim gerekli", { status: 400 });
    }

    // İsmi URL dostu hale getiriyoruz (Slug)
    const slug = name
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

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log("[BRANDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
