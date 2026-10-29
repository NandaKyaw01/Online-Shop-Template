"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function NavbarBrand() {
  const { t } = useLanguage();

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition">
        <Cpu className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
          HARDWARE//CORE
        </span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
          {t.nav.brandSubtitle}
        </span>
      </div>
    </Link>
  );
}
