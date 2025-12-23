"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ArrowRight, X } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, qty } = useSelector((state) => state.cart);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Product removed from cart");
  };

  const handleQuantityChange = (productId, newQty) => {
  if (newQty < 1) return;
  dispatch(updateQuantity({ productId, quantity: newQty }));
};

  const totalPrice = items.reduce(
    (acc, item) =>
      acc +
      (item.discount
        ? ((item.price * (100 - item.discount)) / 100) * item.quantity
        : item.price * item.quantity),
    0
  );

  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart size={48} className="text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cart Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="lg:flex-1 space-y-4">
          {items.map((item) => {
            const discountedPrice = item.discount
              ? (item.price * (100 - item.discount)) / 100
              : item.price;
            const itemTotal = discountedPrice * item.quantity;

            return (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                  <img
                    src={item.images?.[0] || "/default-image.png"}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">৳{discountedPrice.toFixed(2)}</span>
                    {item.discount > 0 && (
                      <span className="line-through text-gray-400 text-sm">৳{item.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Total & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-gray-900">৳{itemTotal.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (VAT 15%)</span>
              <span>৳{(totalPrice * 0.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 border-t pt-2">
              <span>Items</span>
              <span>{qty}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">৳{(totalPrice * 1.15).toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 font-semibold"
          >
            <ShoppingCart size={20} />
            Proceed to Checkout
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}