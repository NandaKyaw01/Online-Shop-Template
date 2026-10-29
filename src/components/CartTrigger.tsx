"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export function CartTrigger() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition"
      aria-label="View Cart"
    >
      <ShoppingBag className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
      <span className="hidden sm:inline">Cart</span>
      {totalCount > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-black">
          {totalCount}
        </span>
      )}
    </button>
  );
}
