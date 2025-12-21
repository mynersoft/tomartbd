"use client";

import { useSelector } from "react-redux";
import ProductSection from "@/components/Home/ProductSection";
import ProductCardSkeleton from "@/components/Skeletons/ProductCardSkeleton";

export default function Home() {
  const { items: products = [], loading } = useSelector(
    (state) => state.product
  );

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellingProducts = products.filter((p) => p.isBestSelling);

  if (loading) {
    return (
      <main className="container mx-auto px-4">
        <ProductSectionSkeleton title="Featured Products" />
        <ProductSectionSkeleton title="Best Selling Products" />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4">
      {featuredProducts.length > 0 && (
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
        />
      )}

      {bestSellingProducts.length > 0 && (
        <ProductSection
          title="Best Selling Products"
          products={bestSellingProducts}
        />
      )}

      {featuredProducts.length === 0 &&
        bestSellingProducts.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No products available
          </p>
        )}
    </main>
  );
}