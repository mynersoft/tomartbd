"use client";

import ProductCard from "@/components/Product/ProductCard";

export default function ProductSection({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}