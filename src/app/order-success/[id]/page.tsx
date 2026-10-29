import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderSuccessClient } from "@/components/order/OrderSuccessClient";
import { OrderDetail } from "@/types";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order: OrderDetail | null = null;
  try {
    const rawOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (rawOrder) {
      order = rawOrder as unknown as OrderDetail;
    }
  } catch (e) {
    console.error("Failed to query order:", e);
  }

  if (!order) {
    notFound();
  }

  return <OrderSuccessClient order={order} />;
}
