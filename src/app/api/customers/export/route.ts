import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { Prisma } from "@prisma/client"; // Prisma tipini import ettik

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    // DÜZELTME BURADA: 'any' yerine 'Prisma.UserWhereInput' kullandık
    let whereClause: Prisma.UserWhereInput = { role: "USER" };

    if (idsParam) {
      const ids = idsParam.split(",");
      whereClause = {
        ...whereClause,
        id: { in: ids },
      };
    }

    const customers = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const csvHeader = "ID,Isim,Soyisim,Email,Telefon,Kayit Tarihi\n";

    const csvRows = customers.map((user) => {
      const clean = (text: string | null) =>
        `"${(text || "").replace(/"/g, '""')}"`;
      return [
        clean(user.id),
        clean(user.firstName),
        clean(user.lastName),
        clean(user.email),
        clean(user.phoneNumber),
        clean(new Date(user.createdAt).toLocaleDateString("tr-TR")),
      ].join(",");
    });

    const csvString = csvHeader + csvRows.join("\n");

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=musteriler.csv",
      },
    });
  } catch (error) {
    console.log("[EXPORT_ERROR]", error);
    return new NextResponse("Hata oluştu", { status: 500 });
  }
}
