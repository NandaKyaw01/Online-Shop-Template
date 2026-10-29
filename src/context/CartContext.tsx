"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { validateCartItemsAction } from "@/app/actions/checkout";

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
  condition: "NEW" | "SECONDHAND";
  stock: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "hardware_store_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount and auto-clean outdated product IDs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          // Auto-verify with database in background
          const ids = parsed.map((i: CartItem) => i.id).filter(Boolean);
          validateCartItemsAction(ids)
            .then((res) => {
              if (res.invalidIds && res.invalidIds.length > 0) {
                const invalidSet = new Set(res.invalidIds);
                setItems((curr) => curr.filter((item) => !invalidSet.has(item.id)));
              }
            })
            .catch((err) => {
              console.error("Cart background check failed:", err);
            });
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, hydrated]);

  const addToCart = (product: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, product.stock);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
