"use client";

import { useState, useEffect } from "react";

export type CartItem = {
  productId: string;
  qty: number;
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.productId === productId);
      if (exist) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
  };
};