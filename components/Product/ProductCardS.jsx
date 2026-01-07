// components/ProductCard.jsx
import React from 'react';

const ProducrCardS = () => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Badge Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-1.5 text-sm font-semibold">
        5% OFF
      </div>

      {/* Product Content */}
      <div className="p-5">
        {/* Brand Name */}
        <div className="mb-4">
          <span className="text-gray-500 text-sm font-semibold tracking-wider">
            NATURE&apos;S BOUNTY
          </span>
        </div>

        {/* Product Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Calcium Magnesium Zinc
          <span className="block text-lg font-semibold text-gray-700 mt-1">
            With Vitamin D3
          </span>
        </h2>

        {/* Benefit Text */}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">
          May Reduce the Risk of Osteoporosis
        </p>

        {/* Discount Tiers - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="text-center">
            <span className="block text-gray-500 text-xs font-semibold">10%</span>
            <span className="block text-gray-400 text-xs mt-1">touch</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 text-xs font-semibold">15%</span>
            <span className="block text-gray-400 text-xs mt-1">private</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 text-xs font-semibold">12-24</span>
            <span className="block text-gray-400 text-xs mt-1">HOURS</span>
          </div>
        </div>

        {/* Mobile Discount Tiers */}
        <div className="md:hidden flex justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-xs font-semibold">10% (touch)</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-500 text-xs font-semibold">15% (private)</span>
          </div>
          <span className="text-gray-500 text-xs font-semibold">12-24 HOURS</span>
        </div>

        {/* Product Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nature&apos;s Bounty Calcium Magnesium...
          </h3>
          
          {/* Ratings */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl">★</span>
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">(9)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-gray-800">₹1663</span>
            <span className="text-lg text-gray-500 line-through">₹1750</span>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
              Save ₹87
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProducrCardS;