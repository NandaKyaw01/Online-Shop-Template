import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { OrderListClient } from "@/components/admin/OrderListClient";
import { AdminNav } from "@/components/admin/AdminNav";
import { OrderDetail } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  let orders: OrderDetail[] = [];
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
  } catch (error) {
    console.error("Failed to query orders in admin:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminNav />

      {/* Main Orders Table & Client Management */}
      <div className="mt-8">
        <OrderListClient initialOrders={orders} />
      </div>
    </div>
  );
}
