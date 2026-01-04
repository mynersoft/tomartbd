'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  X,
} from 'lucide-react';
import Image from 'next/image';

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
  return (
    <div className="lg:flex-1 space-y-4">
      {items.map((item, index) => {
        const discountedPrice = item.discount
          ? (item.price * (100 - item.discount)) / 100
          : item.price;

        return (
          <div key={index} className="flex justify-between">
            <div className="w-20 h-20    mr-2 bg-gray-50 rounded-lg p-2 shrink-0">
              <Image
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.images[0]}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">
                  ৳{discountedPrice.toFixed(2)}
                </span>
                {item.discount > 0 && (
                  <span className="line-through text-gray-400 text-sm">
                    ৳{item.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() =>
                  handleQuantityChange(item._id, item.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleQuantityChange(item._id, item.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>
            {/* Total & Remove */}
            <div className="flex flex-col items-end gap-2">
              <span className="font-bold text-gray-900">
                ৳{subtotal.toFixed(2)}
              </span>
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
  );
};

export default CartItems;
