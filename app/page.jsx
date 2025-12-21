"use client";

import { useSelector } from "react-redux";
import ProductSection from "@/components/home/ProductSection";

export default function Home() {
const products = useSelector((state) => state.product.items);

  const featuredProducts = products.filter(
    (p) => p.isFeatured === true
  );

  const bestSellingProducts = products.filter(
    (p) => p.isBestSelling === true
  );
	return (
	<main className="container mx-auto px-4">
      {/* ⭐ Featured */}
      <ProductSection
        title="Featured Products"
        products={featuredProducts}
      />

      {/* 🔥 Best Selling */}
      <ProductSection
        title="Best Selling Products"
        products={bestSellingProducts}
      />
    </main>
	);
}
