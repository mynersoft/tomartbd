"use client";

import ProductCardNew from "./ProductCardNew";



export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No products found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCardNew key={product._id} product={product} />
      ))}
    </div>
  );
}