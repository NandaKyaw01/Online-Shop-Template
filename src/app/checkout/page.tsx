import { getCurrentUser } from "@/lib/userAuth";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return <CheckoutForm initialUser={user} />;
}
