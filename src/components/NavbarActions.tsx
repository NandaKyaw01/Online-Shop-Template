"use client";

import Link from "next/link";
import { User as UserIcon, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { CartTrigger } from "./CartTrigger";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrentUser } from "@/types";

interface NavbarActionsProps {
  user: CurrentUser | null;
  unreadCount: number;
}

export function NavbarActions({ user, unreadCount }: NavbarActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* User Account Link */}
      {user ? (
        <Link
          href="/profile"
          className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition"
        >
          <UserIcon className="h-3.5 w-3.5 text-emerald-500" />
          <span className="max-w-[100px] truncate">{user.name || user.username}</span>
          {unreadCount > 0 && (
            <span
              title={`${unreadCount} ${t.nav.unreadNotifications}`}
              className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black px-1 ml-0.5"
            >
              {unreadCount}
            </span>
          )}
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition"
        >
          <UserIcon className="h-3.5 w-3.5" />
          <span>{t.nav.signIn}</span>
        </Link>
      )}

      {/* Admin Portal Link */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent hover:border-zinc-200 dark:border-zinc-800 rounded-lg transition"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        <span className="hidden md:inline">{t.nav.admin}</span>
      </Link>

      {/* Theme Toggle (Light / Dark) */}
      <ThemeToggle />

      {/* Cart Trigger */}
      <CartTrigger />
    </div>
  );
}
