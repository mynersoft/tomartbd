// components/CategoriesSection.jsx
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function CategoriesSection() {
  const categories = [
    { name: 'Electronics', icon: '📱', products: '10K+', color: 'bg-blue-50' },
    { name: 'Fashion', icon: '👕', products: '25K+', color: 'bg-pink-50' },
        { name: 'Hardware', icon: '⚙️', products: '8K+', color: 'bg-pink-50' },
            { name: 'Kitchen', icon: '🔪', products: '25K+', color: 'bg-pink-50' },
    {
      name: 'Home',
      icon: '🏠',
      products: '15K+',
      color: 'bg-emerald-50',
    },
        { name: 'Health', icon: '🩺', products: '25K+', color: 'bg-pink-50' },
    { name: 'Beauty', icon: '💄', products: '8K+', color: 'bg-purple-50' },
    { name: 'Sports', icon: '⚽', products: '5K+', color: 'bg-orange-50' },
    { name: 'Books', icon: '📚', products: '12K+', color: 'bg-red-50' },
    { name: 'Automotive', icon: '🚗', products: '3K+', color: 'bg-indigo-50' },
    { name: 'Groceries', icon: '🛒', products: '20K+', color: 'bg-green-50' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className=" font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-600 mt-2">
              Browse products from various categories
            </p>
          </div>
          <button className="text-blue-600 font-semibold flex items-center hover:text-blue-700">
            View All Categories
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.color}  p-3 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group border border-transparent `}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 leading-4">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.products} products
                </p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-1 bg-linear-to-r from-blue-600 to-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
