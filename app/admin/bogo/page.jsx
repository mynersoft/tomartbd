'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BOGOProductsGrid from '@/components/Bogo/BOGOProductsGrid';

const BOGOProductsPage = () => {
  const router = useRouter();

  const handleCreateBOGO = () => {
    router.push('/admin/bogo/create');
  };

  return (
    <>
      <title>BOGO Deals - Special Buy One Get One Offers</title>
      <meta
        name="description"
        content="Discover amazing Buy One Get One Free deals on our best products. Limited time offers with huge savings!"
      />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                BOGO Special Offers
              </h1>
              <p className="text-gray-600 mt-2">
                Buy One Get One Free deals and special promotions
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateBOGO}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create BOGO Offer
              </button>
            </div>
          </div>

          {/* BOGO Products Grid */}
          <div className="mb-12">
            <BOGOProductsGrid />
          </div>

          {/* How It Works Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              How BOGO Works?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Add to Cart
                </h4>
                <p className="text-gray-600 text-sm">
                  Add qualifying products to your cart
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Auto Apply</h4>
                <p className="text-gray-600 text-sm">
                  BOGO discount automatically applies at checkout
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Enjoy Savings
                </h4>
                <p className="text-gray-600 text-sm">
                  Get free items or discounts instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BOGOProductsPage;
