import { getCurrentUser, getUnreadNotificationCount } from "@/lib/userAuth";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarActions } from "./NavbarActions";

export async function Navbar() {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavbarBrand />

        {/* Right Navigation & Actions */}
        <NavbarActions user={user} unreadCount={unreadCount} />
      </div>
    </header>
  );
}
