'use client';

import React, { useEffect } from 'react';
import { Trash2, ShoppingCart, Gift } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { applyBOGOToCart, clearBOGOCart } from '@/store/bogoSlice';
import { useCalculateBOGOCart } from '@/hooks/useBOGOProducts';
import Image from 'next/image';

const CartWithBOGO = ({ cartItems }) => {
  const dispatch = useDispatch();
  const { cartWithBOGO, loading } = useSelector((state) => state.bogo);
  const calculateBOGO = useCalculateBOGOCart();

  useEffect(() => {
    if (cartItems?.length > 0) {
      dispatch(applyBOGOToCart({ cartItems }));
    }
  }, [cartItems, dispatch]);

  const handleCalculateBOGO = async () => {
    try {
      await calculateBOGO.mutateAsync(cartItems);
      toast.success('BOGO discounts applied!');
    } catch (error) {
      toast.error('Failed to apply BOGO');
    }
  };

  const handleClearBOGO = () => {
    dispatch(clearBOGOCart());
    toast.success('BOGO cleared from cart');
  };

  const calculateTotals = () => {
    if (!cartWithBOGO?.length) return { subtotal: 0, discount: 0, total: 0 };

    const subtotal = cartWithBOGO.reduce((sum, item) => {
      return sum + (item.originalPrice || item.price) * item.quantity;
    }, 0);

    const total = cartWithBOGO.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const discount = subtotal - total;

    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Cart with BOGO Offers
        </h2>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={handleCalculateBOGO}
          disabled={loading || calculateBOGO.isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Apply BOGO Offers
        </button>
        <button
          onClick={handleClearBOGO}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear BOGO
        </button>
      </div>

      {/* Cart Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">
                Product
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">
                Price
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">
                Qty
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">
                Total
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {cartWithBOGO.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || '/default-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {item.variant.color} / {item.variant.size}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        item.isFreeItem
                          ? 'line-through text-gray-400'
                          : 'font-bold'
                      }
                    >
                      ${item.price.toFixed(2)}
                    </span>
                    {item.isFreeItem && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        FREE
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.quantity}</span>
                    {item.isFreeItem && (
                      <Gift className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={
                      item.isFreeItem ? 'text-green-600 font-bold' : 'font-bold'
                    }
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                    {item.isFreeItem && ' (FREE)'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {item.isFreeItem ? (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      FREE ITEM
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      PAID
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2 max-w-md ml-auto">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>BOGO Savings:</span>
              <span className="font-bold">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Message */}
      {discount > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">
                You're saving ${discount.toFixed(2)} with BOGO offers!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Free items have been automatically added to your cart
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default CartWithBOGO;
