import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/userAuth";
import { redirect } from "next/navigation";
import { ProfileViewClient } from "@/components/profile/ProfileViewClient";

import { OrderDetail, NotificationItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  let orders: OrderDetail[] = [];
  let notifications: NotificationItem[] = [];

  try {
    orders = await prisma.order.findMany({
      where: { user_id: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    notifications = await prisma.notification.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Failed to load profile data:", error);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProfileViewClient user={user} orders={orders} notifications={notifications} />
    </div>
  );
}
