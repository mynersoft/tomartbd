// components/NewArrivals.jsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { generateMockProducts, getNewArrivals } from '@/utils/mockProducts';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30'); // 30 days

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = generateMockProducts(30);
      const newArrivals = getNewArrivals(mockProducts, parseInt(timeFilter));
      setProducts(newArrivals);
      setLoading(false);
    }, 500);
  }, [timeFilter]);

  const handleTimeFilterChange = (days) => {
    setTimeFilter(days);
    setLoading(true);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-600">
              Explore our latest additions to the collection
            </p>
          </div>

          {/* Time Filters */}
          <div className="flex gap-2">
            {[
              { days: '7', label: 'Last 7 Days' },
              { days: '30', label: 'Last 30 Days' },
              { days: '90', label: 'Last 90 Days' }
            ].map((filter) => (
              <button
                key={filter.days}
                onClick={() => handleTimeFilterChange(filter.days)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  timeFilter === filter.days
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals found for the selected period</p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 8 && (
          <div className="text-center mt-10">
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300">
              View All New Arrivals ({products.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;