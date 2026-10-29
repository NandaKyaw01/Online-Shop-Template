"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalAmount,
    totalCount,
  } = useCart();
  const { t, formatPrice } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-2xl transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-500" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {t.cart.title} ({totalCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <ShoppingBag className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                <p className="text-sm font-mono text-zinc-500 font-medium">{t.cart.emptyTitle}</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">{t.cart.emptySubtitle}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-lg transition"
                >
                  {t.cart.browseInventory}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 items-center shadow-sm"
                >
                  {/* Strict 1:1 Aspect ratio thumbnail */}
                  <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        {item.condition === "NEW" ? t.product.conditionNew : t.product.conditionSecondhand}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                  {t.cart.subtotal}
                </span>
                <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition active:scale-[0.99] shadow"
              >
                <span>{t.cart.proceedToCheckout}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
