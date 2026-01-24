'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCardNew from '@/components/Product/ProductCardNew';

const ITEMS_VISIBLE = 4;
const AUTO_PLAY_DELAY = 4000;

const FeaturedProductsSlider = ({ products = [] }) => {
  const featuredProducts = products.filter(
    p => p?.type?.toLowerCase() === 'featured'
  );

  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);

  const total = featuredProducts.length;

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || total <= ITEMS_VISIBLE) return;

    const interval = setInterval(() => {
      next();
    }, AUTO_PLAY_DELAY);

    return () => clearInterval(interval);
  }, [index, isAutoPlaying, total]);

  const next = () => {
    setIndex(prev =>
      prev >= total - ITEMS_VISIBLE ? 0 : prev + 1
    );
  };

  const prev = () => {
    setIndex(prev =>
      prev <= 0 ? total - ITEMS_VISIBLE : prev - 1
    );
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full px-4 py-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-gray-500">Top picks for you</p>
        </div>

        {total > ITEMS_VISIBLE && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-3 py-1 text-sm bg-gray-100 rounded"
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <button onClick={prev} className="p-2 bg-white rounded-full shadow">
              <ChevronLeft />
            </button>
            <button onClick={next} className="p-2 bg-white rounded-full shadow">
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Slider */}
      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(index * 100) / ITEMS_VISIBLE}%)`,
          }}
        >
          {featuredProducts.map(product => (
            <div
              key={product._id}
              className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
            >
              <ProductCardNew product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {total > ITEMS_VISIBLE && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: total - ITEMS_VISIBLE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsSlider;