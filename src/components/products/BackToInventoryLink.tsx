"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BackToInventoryLink() {
  const { t } = useLanguage();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>{t.product.backToInventory}</span>
    </Link>
  );
}
