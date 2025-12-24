import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("İsim gerekli", { status: 400 });
    }

    // Artık categoryId vermeden özellik oluşturabiliyoruz
    const attribute = await prisma.attribute.create({
      data: {
        name,
      },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.log("[ATTRIBUTES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
