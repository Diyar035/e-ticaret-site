import { Prisma } from "@prisma/client";

// 1. Prisma'nın ham ilişkili tipini alıyoruz
type PrismaProductFull = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    attributeValues: true;
  };
}>;

// 2. Çakışan alanları (Decimal olanlar) çıkartıp yerlerine number koyuyoruz
export type ProductWithRelations = Omit<PrismaProductFull, "price" | "salePrice" | "variants"> & {
  price: number;
  salePrice: number | null;
  stock: number;
  variants: Array<
    Omit<PrismaProductFull["variants"][number], "price" | "stock"> & {
      price: number;
      stock: number;
    }
  >;
};