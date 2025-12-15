'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Summer Sale is Here!
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Get up to 50% off on selected items. Limited time offer. Shop now and save big!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg flex items-center justify-center transition duration-300"
            >
              Shop Now
              <ChevronRight className="ml-2" />
            </Link>
            <Link
              href="/deals"
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              View Deals
            </Link>
          </div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white"></div>
      </div>
    </div>
  );
}