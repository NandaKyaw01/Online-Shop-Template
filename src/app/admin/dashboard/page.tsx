import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { OrderDetail, ProductItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  let orders: OrderDetail[] = [];
  let products: ProductItem[] = [];

  try {
    orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    products = await prisma.product.findMany();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <AdminNav />
      <AdminDashboardClient orders={orders} products={products} />
    </div>
  );
}
