'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCardNew from './ProductCardNew';
import Link from 'next/link';

const ProductSlider = ({ products = [], title = "Featured Products", subtitle = "Top picks for you" }) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleItems, setVisibleItems] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Calculate visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);  // mobile
      else if (width < 768) setVisibleItems(2);  // tablet
      else if (width < 1024) setVisibleItems(3);  // small desktop
      else setVisibleItems(4);  // large desktop
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleItems);
  const itemWidth = 100 / visibleItems;

  // Auto slide
  useEffect(() => {
    if (isHovering || isAnimating || products.length <= visibleItems) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovering, isAnimating, maxIndex, products.length, visibleItems]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, maxIndex]);

  const goToSlide = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (products.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If we have fewer products than visible items, don't show slider controls
  const showSliderControls = products.length > visibleItems;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {showSliderControls && (
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex && visibleItems < products.length}
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
          <Link
            href="/shop"
            className="text-pink-600 hover:text-pink-700 font-medium transition-colors hidden sm:block border border-pink-600 hover:border-pink-700 px-4 py-2 rounded-lg hover:bg-pink-50"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress Bar */}
        {showSliderControls && maxIndex > 0 && (
          <div className="absolute top-0 left-0 right-0 -mt-8 z-10">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
                style={{
                  width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Slider */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className={`flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              isAnimating ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `translateX(-${currentIndex * itemWidth}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="min-w-full sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] p-3"
                style={{ flex: `0 0 ${itemWidth}%` }}
              >
                <ProductCardNew product={product} />
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          {showSliderControls && currentIndex > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}
          {showSliderControls && currentIndex < maxIndex && (
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Dots Indicator */}
        {showSliderControls && maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile View All */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          View All Products
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Free Shipping', 
              value: 'On orders over ৳500',
              icon: '🚚'
            },
            { 
              label: '24/7 Support', 
              value: 'Online 24 hours',
              icon: '💬'
            },
            { 
              label: 'Secure Payment', 
              value: '100% secured',
              icon: '🔒'
            },
            { 
              label: 'Easy Returns', 
              value: 'Within 30 days',
              icon: '↩️'
            },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-pink-200 transition-colors duration-300">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <h4 className="font-semibold text-gray-900">{stat.label}</h4>
              <p className="text-sm text-gray-600 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;