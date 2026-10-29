"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: "NEW" | "SECONDHAND";
  stock: number;
  image_url: string;
}

export function ProductCatalog({ initialProducts }: { initialProducts: ProductData[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | "NEW" | "SECONDHAND">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = initialProducts.filter((product) => {
    const matchesFilter = filter === "ALL" || product.condition === filter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        {/* Condition Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800/80 w-fit">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "ALL"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.home.allInventory} ({initialProducts.length})
          </button>
          <button
            onClick={() => setFilter("NEW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "NEW"
                ? "bg-emerald-500 text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.home.newParts} ({initialProducts.filter((p) => p.condition === "NEW").length})
          </button>
          <button
            onClick={() => setFilter("SECONDHAND")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "SECONDHAND"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.home.secondhand} ({initialProducts.filter((p) => p.condition === "SECONDHAND").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder={t.home.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 shadow-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-500 font-mono text-sm">
            {t.home.noResults}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
