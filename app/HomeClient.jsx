'use client';

import CategoriesSection from '@/components/CategoriesSection';
import FeaturedVendors from '@/components/FeaturedVendors';
import { useSelector } from 'react-redux';
import ProductGrid from '@/components/Product/ProductGrid';

import FeaturedProductsSlider from './FeaturedProductsSlider';
import ProductSlider from '@/components/Product/ProductSlider';
import { HeroComboSection } from '../components/Home/HeroComboBanner';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const { products } = useSelector((state) => state.product);

  const { combos } = useSelector((state) => state.combo);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6">
        <ProductSlider products={products} />

        <HeroComboSection combos={combos || []} />
        {/* Categories Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className=" font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-2">
                Browse products from various categories
              </p>
            </div>
            <button className="text-blue-600 font-semibold flex items-center hover:text-blue-700">
              View All Categories
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
          <CategoriesSection />
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <ProductGrid products={products} />
        </div>

        <div className="container mx-auto">
          <FeaturedProductsSlider products={products} />
        </div>

        {/* Featured Vendors */}
        <div className="mb-6">
          <FeaturedVendors />
        </div>
      </main>
    </div>
  );
}
