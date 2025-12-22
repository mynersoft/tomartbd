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
        {/* Cart Items Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const discountedPrice = item.discount 
                      ? (item.price * (100 - item.discount)) / 100 
                      : item.price;
                    const itemTotal = discountedPrice * item.quantity;
                    
                    return (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Product Cell */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                              <img
                                src={item.images?.[0] || "/default-image.png"}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.brand}</p>
                              {item.color && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-gray-600">Color:</span>
                                  <div 
                                    className="w-4 h-4 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: item.color }}
                                  />
                                </div>
                              )}
                              {item.size && (
                                <div className="mt-1">
                                  <span className="text-sm text-gray-600">Size: {item.size}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Price Cell */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              ৳{discountedPrice.toFixed(2)}
                            </span>
                            {item.discount > 0 && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ৳{item.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-red-600 font-medium mt-1">
                                  Save {item.discount}%
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Quantity Cell */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900 text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>

                        {/* Total Cell */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-lg text-gray-900">
                            ৳{itemTotal.toFixed(2)}
                          </div>
                        </td>

                        {/* Actions Cell */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden">
              {items.map((item) => {
                const discountedPrice = item.discount 
                  ? (item.price * (100 - item.discount)) / 100 
                  : item.price;
                const itemTotal = discountedPrice * item.quantity;
                
                return (
                  <div key={item._id} className="p-4 border-b border-gray-100">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                        <img
                          src={item.images?.[0] || "/default-image.png"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                          </div>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="text-gray-400 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {/* Price Info */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              ৳{discountedPrice.toFixed(2)}
                            </span>
                            {item.discount > 0 && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ৳{item.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-red-600 font-medium">
                                  {item.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="font-bold text-gray-900">
                            ৳{itemTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
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
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">৳{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (VAT)</span>
                <span className="font-medium text-gray-900">৳{(totalPrice * 0.15).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                <span>Items</span>
                <span>{qty}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ৳{(totalPrice + (totalPrice * 0.15)).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg mb-4"
            >
              <ShoppingCart size={20} />
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">We Accept</p>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">VISA</span>
                </div>
                <div className="w-10 h-6 bg-yellow-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-800">MC</span>
                </div>
                <div className="w-10 h-6 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-800">PP</span>
                </div>
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">COD</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
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
                  <p className="text-xs text-gray-500 mt-1">
                    256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <span className="font-medium">30-Day Return Policy</span> · Free shipping on orders over ৳2000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}