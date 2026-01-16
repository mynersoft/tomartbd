'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";




// data/categories.js
import {
  ShoppingBasket,
  Smartphone,
  Shirt,
  Home,
} from "lucide-react";

export const categories = [
  {
    name: "Groceries",
    slug: "groceries",
    icon: ShoppingBasket,
    sub: [
      { name: "Rice", slug: "rice" },
      { name: "Oil", slug: "oil" },
      { name: "Sugar", slug: "sugar" },
    ],
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: Smartphone,
    sub: [
      { name: "Mobile", slug: "mobile" },
      { name: "Laptop", slug: "laptop" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: Shirt,
    sub: [
      { name: "Men", slug: "men" },
      { name: "Women", slug: "women" },
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: Home,
    sub: [
      { name: "Cookware", slug: "cookware" },
      { name: "Furniture", slug: "furniture" },
    ],
  },
];

export default function CategorySidebar() {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <h3 className="px-4 py-3 font-semibold border-b">
        Categories
      </h3>

      <ul>
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isOpen = active === index;

          return (
            <li key={index} className="border-b last:border-b-0">

              {/* Category */}
              <div
                onClick={() => toggle(index)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-emerald-50"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 text-sm"
                >
                  <Icon size={18} className="text-emerald-600" />
                  {cat.name}
                </Link>

                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>

              {/* Sub Categories */}
              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-gray-50 overflow-hidden"
                  >
                    {cat.sub.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="block px-10 py-2 text-sm hover:text-emerald-600"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

            </li>
          );
        })}
      </ul>
    </div>
  );
}