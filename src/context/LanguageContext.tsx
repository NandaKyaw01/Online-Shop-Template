"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Locale, translations, Translations } from "@/lib/i18n/translations";
import { formatMMK } from "@/lib/currency";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
  formatPrice: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "hardware_store_locale_v1";
const COOKIE_NAME = "NEXT_LOCALE";

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync from localStorage or cookie on initial load
  useEffect(() => {
    try {
      let activeLocale = initialLocale;
      const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (savedLocale === "en" || savedLocale === "my") {
        activeLocale = savedLocale;
      } else {
        const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
        if (match && (match[2] === "en" || match[2] === "my")) {
          activeLocale = match[2] as Locale;
        }
      }
      setLocaleState(activeLocale);
      document.documentElement.lang = activeLocale;
      if (activeLocale === "my") {
        document.documentElement.classList.add("lang-my");
      } else {
        document.documentElement.classList.remove("lang-my");
      }
    } catch (e) {
      console.error("Failed to read locale preference:", e);
    }
    setIsHydrated(true);
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      // Set cookie for 1 year so SSR can read
      document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;
      if (newLocale === "my") {
        document.documentElement.classList.add("lang-my");
      } else {
        document.documentElement.classList.remove("lang-my");
      }
    } catch (e) {
      console.error("Failed to persist locale:", e);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "my" : "en");
  };

  const t = useMemo(() => translations[locale], [locale]);

  const formatPrice = useMemo(() => {
    return (amount: number) => formatMMK(amount, locale);
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
