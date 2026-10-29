"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  Check,
  ShieldCheck,
  Plus,
  Minus,
  Truck,
} from "lucide-react";

interface ProductDetailClientProps {
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

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { t, formatPrice } = useLanguage();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
      {/* Left: 1:1 Aspect Ratio Product Image */}
      <div className="md:col-span-6">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-center">
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-flex items-center px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                product.condition === "NEW"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {product.condition === "NEW" ? t.product.conditionNew : t.product.conditionSecondhand}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              {product.stock > 0 ? `${product.stock} ${t.product.unitsInStock}` : t.product.outOfStock}
            </span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain max-h-[450px]"
          />
        </div>
      </div>

      {/* Right: Product Details & Purchase Actions */}
      <div className="md:col-span-6 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {product.title}
            </h1>
            <p className="mt-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              ID: {product.id}
            </p>
          </div>

          {/* Price */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 flex items-baseline gap-3">
            <span className="text-xs font-mono text-zinc-500 uppercase">{t.product.price}:</span>
            <span className="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Technical Description */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.product.specifications}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-white dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                {t.product.quantity}:
              </span>
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 px-3">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                ({t.product.subtotal}: {formatPrice(product.price * quantity)})
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`py-3 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition ${
                product.stock <= 0
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 border-transparent cursor-not-allowed"
                  : added
                  ? "bg-emerald-500 text-black border-emerald-500 font-bold"
                  : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{t.product.added} ({quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t.product.addToCart}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              <Zap className="h-4 w-4" />
              <span>{t.cart.proceedToCheckout}</span>
            </button>
          </div>

          {/* Guarantees & Features */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60">
              <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Tested &amp; Guaranteed Working</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60">
              <Truck className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span>Direct KBZPay Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
