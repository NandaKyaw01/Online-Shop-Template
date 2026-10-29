import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "HARDWARE//CORE - PC Components & Workstations",
  description: "Minimalist computer hardware e-commerce store with manual KBZPay payment verification in MMK.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLocale: Locale = localeCookie === "my" ? "my" : "en";

  return (
    <html
      lang={initialLocale}
      className={`dark ${initialLocale === "my" ? "lang-my" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col antialiased transition-colors">
        <LanguageProvider initialLocale={initialLocale}>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
