// components/CategoriesSection.jsx
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

export default function CategoriesSection() {
  const { categories } = useSelector((state) => state.category);

  const bgColor = [
    'bg-blue-50',
    'bg-pink-50',
    'bg-emerald-50',
    'bg-pink-50',
    'bg-purple-50',
    'bg-orange-50',
    'bg-red-50',
    'bg-indigo-50',
    'bg-green-50',
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${bgColor[index]}  p-3 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group border border-transparent `}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 leading-4">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">8k+ products</p>
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
