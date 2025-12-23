import Link from "next/link";
import { prisma } from "@/lib/prisma-client";
import { ChevronRight } from "lucide-react";

export default async function CategoryMenu() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { children: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b font-bold text-gray-700">
        Kategoriler
      </div>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="border-b last:border-0 hover:bg-blue-50 transition"
          >
            <Link
              href={`/category/${cat.slug}`}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                {cat.name}
              </div>
              {cat._count.children > 0 && (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
