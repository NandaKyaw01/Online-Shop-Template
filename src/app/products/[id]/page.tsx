import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { BackToInventoryLink } from "@/components/products/BackToInventoryLink";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to query product:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <BackToInventoryLink />
      </div>

      {/* Main Product Details View */}
      <ProductDetailClient product={product} />
    </div>
  );
}
