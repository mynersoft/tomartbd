// components/Dashboard/TopProducts.js
'use client';

import React from 'react';
import { Star, TrendingUp, Eye, ShoppingCart, Heart } from 'lucide-react';

const TopProducts = ({ theme }) => {
  const products = [
    {
      name: 'Wireless Headphones Pro',
      category: 'Electronics',
      price: '$299.99',
      sales: 1245,
      rating: 4.8,
      image: '🎧',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      growth: 24,
    },
    {
      name: 'Premium Watch Series X',
      category: 'Fashion',
      price: '$499.99',
      sales: 892,
      rating: 4.9,
      image: '⌚',
      color: 'bg-purple-100 dark:bg-purple-900/30',
      growth: 18,
    },
    {
      name: 'Smart Home Speaker',
      category: 'Electronics',
      price: '$179.99',
      sales: 1567,
      rating: 4.7,
      image: '🔊',
      color: 'bg-green-100 dark:bg-green-900/30',
      growth: 32,
    },
    {
      name: 'Designer Backpack',
      category: 'Fashion',
      price: '$89.99',
      sales: 2345,
      rating: 4.6,
      image: '🎒',
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      growth: 12,
    },
  ];

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Top Products
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Best selling items
          </p>
        </div>
        <button
          className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors`}
        >
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
          >
            <div
              className={`w-14 h-14 rounded-xl ${product.color} flex items-center justify-center text-2xl`}
            >
              {product.image}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {product.name}
                  </p>
                  <p
                    className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {product.category}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {product.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {product.price}
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3 text-gray-400" />
                    <span
                      className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {product.sales.toLocaleString()} sold
                    </span>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${
                    product.growth > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {product.growth > 0 ? '+' : ''}
                  {product.growth}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product metrics summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Eye
                className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              />
              <span
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Total Views
              </span>
            </div>
            <p
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              42.8K
            </p>
          </div>

          <div
            className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Heart
                className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              />
              <span
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Wishlist Adds
              </span>
            </div>
            <p
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              2.4K
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
