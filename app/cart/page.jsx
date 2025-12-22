"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";

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
            href="/products"
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
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ShoppingCart className="text-blue-600" size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {qty} {qty === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const discountedPrice = item.discount 
                ? (item.price * (100 - item.discount)) / 100 
                : item.price;
              
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="sm:w-32 md:w-40 flex-shrink-0 bg-gray-50 p-4">
                      <img
                        src={item.images?.[0] || "/default-image.png"}
                        alt={item.name}
                        className="w-full h-40 object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="font-semibold text-lg text-gray-900 mb-2">
                            {item.name}
                          </h2>
                          <p className="text-gray-500 text-sm mb-3">{item.brand}</p>
                          
                          {/* Price Display */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="font-bold text-xl text-blue-600">
                              ৳{discountedPrice.toFixed(2)}
                            </span>
                            {item.discount > 0 && (
                              <>
                                <span className="text-gray-400 line-through">
                                  ৳{item.price.toFixed(2)}
                                </span>
                                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                                  {item.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Item Total</p>
                            <p className="font-bold text-lg text-gray-900">
                              ৳{(discountedPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Order Summary
            </h2>

            {/* Summary Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({qty} {qty === 1 ? 'item' : 'items'})</span>
                <span className="font-medium text-gray-900">৳{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">৳{totalPrice.toFixed(2)}</div>
                  <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>

            {/* Continue Shopping */}
            <div className="mt-6 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </Link>
            </div>

            {/* Security Info */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Secure checkout</span>. Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}