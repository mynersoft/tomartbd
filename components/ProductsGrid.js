// components/ProductsGrid.jsx
'use client';

import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ 
  products, 
  title, 
  subtitle,
  loading = false,
  emptyMessage = "No products found",
  columns = 4 
}) => {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {title && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
          )}
          <div className={`grid ${gridClasses[columns]} gap-6`}>
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
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          {title && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
          )}
          <p className="text-gray-500 py-12">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}
        
        <div className={`grid ${gridClasses[columns]} gap-6`}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;