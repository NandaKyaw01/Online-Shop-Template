"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8 text-center text-xs font-mono text-zinc-500 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {t.footer.rightsReserved}</p>
        <div className="flex items-center gap-6">
          <span>{t.footer.directKPay}</span>
          <span>{t.footer.localStock}</span>
          <span>{t.footer.themeMode}</span>
        </div>
      </div>
    </footer>
  );
}
