'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  X,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import CheckEmptyCart from './CheckEmptyCart';

const CartItems = ({ subtotal }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Product removed from cart');
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQty }));
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount?.value) return price;

    if (discount.type === 'percentage') {
      return (price * (100 - discount.value)) / 100;
    } else if (discount.type === 'fixed') {
      return Math.max(price - discount.value, 0);
    }

    return price;
  };

  // Helper function to get discount text
  const getDiscountText = (discount) => {
    if (!discount?.value) return null;

    if (discount.type === 'percentage') {
      return `${discount.value}% OFF`;
    } else if (discount.type === 'fixed') {
      return `৳${discount.value} OFF`;
    }

    return null;
  };

  // Calculate item total
  const calculateItemTotal = (item) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
    return discountedPrice * item.quantity;
  };

  return (
    <div className="lg:flex-1">
      {/* Empty Cart State */}
      {items.length === 0 ? (
        <CheckEmptyCart />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-600">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Cart Items */}
          {items.map((item, index) => {
            const discountedPrice = calculateDiscountedPrice(
              item.price,
              item.discount
            );
            const discountText = getDiscountText(item.discount);
            const itemTotal = calculateItemTotal(item);
            const originalItemTotal = item.price * item.quantity;
            const savedAmount = originalItemTotal - itemTotal;

            return (
              <div
                key={`${item._id}-${index}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  {/* Product Image & Info */}
                  <div className="flex items-start gap-4 md:w-5/12">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-2 shrink-0">
                      <Image
                        src={item.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      {/* Discount Badge */}
                      {discountText && (
                        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {discountText}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Price Display for Mobile */}
                      <div className="md:hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            ৳{discountedPrice.toFixed(2)}
                          </span>
                          {discountedPrice < item.price && (
                            <>
                              <span className="text-gray-400 line-through text-sm">
                                ৳{item.price.toFixed(2)}
                              </span>
                              <span className="text-green-600 text-sm font-semibold">
                                Save ৳
                                {(item.price - discountedPrice).toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Column (Desktop) */}
                  <div className="hidden md:block md:w-2/12">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        ৳{discountedPrice.toFixed(2)}
                      </div>
                      {discountedPrice < item.price && (
                        <div className="space-y-1">
                          <div className="text-gray-400 line-through text-sm">
                            ৳{item.price.toFixed(2)}
                          </div>
                          <div className="text-green-600 text-xs font-semibold">
                            Save ৳{(item.price - discountedPrice).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:w-3/12">
                    <div className="flex items-center justify-between md:justify-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-14 h-10 flex items-center justify-center bg-gray-50 rounded-xl font-bold text-gray-900 text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* Remove Button (Mobile) */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="md:hidden p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove (Desktop) */}
                  <div className="md:w-2/12">
                    <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ৳{itemTotal.toFixed(2)}
                        </div>
                        {savedAmount > 0 && (
                          <div className="text-sm text-green-600 font-semibold">
                            Saved ৳{savedAmount.toFixed(2)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          ৳{discountedPrice.toFixed(2)} × {item.quantity}
                        </div>
                      </div>

                      {/* Remove Button (Desktop) */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary for Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-100 md:hidden">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Item Total:{' '}
                      <span className="font-bold text-gray-900">
                        ৳{itemTotal.toFixed(2)}
                      </span>
                    </div>
                    {savedAmount > 0 && (
                      <div className="text-sm font-semibold text-green-600">
                        You save ৳{savedAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CartItems;
