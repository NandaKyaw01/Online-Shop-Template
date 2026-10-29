"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: "NEW" | "SECONDHAND";
    stock: number;
    image_url: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col justify-between bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 rounded-2xl p-3.5 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm">
      {/* 1:1 Strict Aspect Ratio Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 block"
      >
        {/* Condition Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider ${
              product.condition === "NEW"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            }`}
          >
            {product.condition === "NEW" ? t.product.conditionNew : t.product.conditionSecondhand}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            {product.stock > 0
              ? `${product.stock} ${t.product.inStock}`
              : t.product.outOfStock}
          </span>
        </div>

        {/* Product Image with Strict Object Cover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="mt-3.5 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-emerald-500 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
              {t.product.price}
            </span>
            <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              product.stock <= 0
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : justAdded
                ? "bg-emerald-500 text-black font-semibold"
                : "bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black active:scale-95 shadow-sm"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{t.product.added}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>{t.product.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
