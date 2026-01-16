'use client';

import CategoriesSection from '@/components/Home/CategoriesSection';
import FeaturedVendors from '@/components/FeaturedVendors';
import ProductCardNew from '@/components/Product/ProductCardNew';
import { useSelector } from 'react-redux';
import ProductGrid from '@/components/Product/ProductGrid';
import ComboOffer from '@/components/Home/ComboOffer';
import CategorySidebar from "@/components/Home/CategorySidebar";

export default function Home() {
  const { products } = useSelector((state) => state.product);
  const { combos, isLoading } = useSelector((state) => state.combo);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6">

        {/* Top Grid: Left Categories + Right Combos */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          {/* Left Categories */}
          <div className="col-span-12 md:col-span-3">
            <CategorySidebar />
          </div>

          {/* Right Combo Offers */}
          <div className="col-span-12 md:col-span-9 space-y-4">
            {combos.length > 0 && combos.map((combo, index) => (
              <ComboOffer key={index} combo={combo} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <CategoriesSection />
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <ProductGrid products={products} />
        </div>

        {/* Featured Vendors */}
        <div className="mb-6">
          <FeaturedVendors />
        </div>

      </main>
    </div>
  );
}