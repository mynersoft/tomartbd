'use client';

import { useState } from "react";


export const categories = [
  {
    name: "Groceries",
    sub: ["Rice", "Oil", "Sugar", "Salt", "Dal"]
  },
  {
    name: "Electronics",
    sub: ["Mobile", "Laptop", "TV", "Headphone"]
  },
  {
    name: "Fashion",
    sub: ["Men", "Women", "Kids"]
  },
  {
    name: "Home & Kitchen",
    sub: ["Cookware", "Furniture", "Decor"]
  }
];



export default function CategorySidebar() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative flex bg-white border rounded-lg shadow-sm">

      {/* Main Category */}
      <ul className="w-60 border-r">
        {categories.map((cat, index) => (
          <li
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className="px-4 py-3 cursor-pointer hover:bg-emerald-50 flex justify-between items-center text-sm"
          >
            {cat.name}
            <span>›</span>
          </li>
        ))}
      </ul>

      {/* Sub Category Panel */}
      {activeIndex !== null && (
        <div
          className="absolute left-60 top-0 w-64 bg-white border shadow-lg h-full p-4"
          onMouseEnter={() => setActiveIndex(activeIndex)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <h4 className="font-semibold mb-3">
            {categories[activeIndex].name}
          </h4>

          <ul className="space-y-2 text-sm">
            {categories[activeIndex].sub.map((sub, i) => (
              <li
                key={i}
                className="hover:text-emerald-600 cursor-pointer"
              >
                {sub}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}