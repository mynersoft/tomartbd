"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import useLoginUser from "@/hooks/useAuth";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
} from "@/redux/cartSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { items, qty } = useSelector((state) => state.cart);
  const { user } = useLoginUser();

  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPrice = items?.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      {/* ================= CART DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[380px] bg-white shadow-xl transform transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={() => setIsCartOpen(false)}>
              <X size={22} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items?.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border rounded-lg p-3"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ৳{item.price}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(decrementQty(item.id))}
                        className="p-1 border rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQty(item.id))}
                        className="p-1 border rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-20">
                Your cart is empty
              </p>
            )}
          </div>

          {/* Footer */}
          {items?.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>৳{totalPrice}</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center bg-[#004488] text-white py-3 rounded-lg hover:bg-[#003366]"
              >
                Checkout
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center border py-3 rounded-lg"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#004488]">
            Tomart<span className="text-[#C0A460]">BD</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/wishlist">
              <Heart size={22} />
            </Link>

            {/* CART ICON */}
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart size={22} />
              {mounted && qty > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C0A460] text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {qty}
                </span>
              )}
            </button>

            <Link href={user ? "/dashboard/user" : "/auth/login"}>
              <User size={22} />
            </Link>

            <Menu size={22} />
          </div>
        </div>
      </header>
    </>
  );
}