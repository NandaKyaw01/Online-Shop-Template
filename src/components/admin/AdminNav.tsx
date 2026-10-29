"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogoutAction } from "@/app/actions/admin";
import { useLanguage } from "@/context/LanguageContext";
import {
  ClipboardList,
  Boxes,
  TrendingUp,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/admin/orders", label: t.admin.orders, icon: ClipboardList },
    { href: "/admin/products", label: t.admin.products, icon: Boxes },
    { href: "/admin/dashboard", label: t.admin.dashboard, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono mb-2">
          <ShieldCheck className="h-3 w-3" />
          <span>{t.admin.portalTitle} (admin / pass123)</span>
        </div>
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
          HARDWARE//CORE OPERATIONS
        </h1>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-1.5 mt-4 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  active
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-mono transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>{t.admin.backToStore}</span>
        </Link>

        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-mono transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t.admin.signOut}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
