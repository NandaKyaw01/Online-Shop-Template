import { prisma } from "@/lib/prisma";
import { ProductCatalog } from "@/components/ProductCatalog";
import { HomeHero } from "@/components/HomeHero";
import { ProductItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: ProductItem[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Database query failed:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <HomeHero />

      {/* Responsive 1:1 Product Grid & Filters */}
      <ProductCatalog initialProducts={products} />
    </div>
  );
}
