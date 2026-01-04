'use client';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, ArrowRight } from 'lucide-react';
import { calculateShippingFee } from '@/lib/calculateShippingFee';
import CartItems from '@/components/Cart/CartItems';

export default function CartPage() {
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      (item.discount
        ? ((item.price * (100 - item.discount)) / 100) * item.quantity
        : item.price * item.quantity),
    0
  );

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  const shippingFee = calculateShippingFee({
    subtotal,
    location: 'Daka',
  });

  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart size={48} className="text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start
            shopping to discover amazing products!
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

        <CartItems subtotal={subtotal} />

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
            Order Summary
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalQty} items)</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">
                {shippingFee === 0 ? 'Fee' : shippingFee}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-blue-600">
              ৳{(subtotal * 1.15).toFixed(2)}
            </span>
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
