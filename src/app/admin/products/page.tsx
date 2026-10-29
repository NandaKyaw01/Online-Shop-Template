import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductManagerClient } from "@/components/admin/ProductManagerClient";
import { ProductItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  let products: ProductItem[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Failed to query products:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminNav />

      <div className="mt-8">
        <ProductManagerClient initialProducts={products} />
      </div>
    </div>
  );
}
