"use client";

import { Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <div className="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800/80">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono mb-4">
        <Zap className="h-3 w-3" />
        <span>{t.home.badge}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t.home.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
        {t.home.description}
      </p>
    </div>
  );
}
