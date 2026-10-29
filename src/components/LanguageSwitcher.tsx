"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Language / ဘာသာစကား ရွေးချယ်ရန်"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-150 shadow-sm"
      >
        <Globe className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-semibold tracking-wide">
          {locale === "en" ? "EN" : "MY"}
        </span>
        <span className="text-[10px] text-zinc-400 font-sans hidden sm:inline">
          {locale === "en" ? "Eng" : "မြန်မာ"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Select Language
            </span>
          </div>

          {/* English Option */}
          <button
            onClick={() => {
              setLocale("en");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition text-left ${
              locale === "en"
                ? "bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English (EN)</span>
            </div>
            {locale === "en" && <Check className="h-3.5 w-3.5 text-emerald-500" />}
          </button>

          {/* Myanmar Option */}
          <button
            onClick={() => {
              setLocale("my");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition text-left ${
              locale === "my"
                ? "bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇲🇲</span>
              <span className="font-sans">မြန်မာဘာသာ (MY)</span>
            </div>
            {locale === "my" && <Check className="h-3.5 w-3.5 text-emerald-500" />}
          </button>
        </div>
      )}
    </div>
  );
}
