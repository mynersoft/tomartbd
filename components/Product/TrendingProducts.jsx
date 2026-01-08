"use client";
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import ProductQuickView from "./ProductQuickView";
import Link from "next/link";

export default function TrendingProducts() {

const dispatch = useDispatch();

        const wishlist = useSelector((state) => state.wishlist.items);

const {products} = useSelector((state) => state.product);

        const isWishlisted = wishlist.some((item) => item._id === product._id);
        const [open, setOpen] = useState(false);

        // ✅ Discount price
        const calculateDiscountPrice = () => {
                if (product.discount && product.discount > 0) {
                        return (product.price * (100 - product.discount)) / 100;
                }
                return product.price;
        };

        const formatPrice = (price) => Number(price).toFixed(2);

        const discountPrice = calculateDiscountPrice();
        const hasDiscount = product.discount && product.discount > 0;

        const handleToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(toggleWishlist(product));
                toast.success(
                        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
                );
        };

        const handleAddToCart = (e) => {
                if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                }
                dispatch(addToCart({ product }));
                toast.success("Added to cart!");
        };

        // Get product slug/ID for URL
        const productSlug = product.slug || product._id;
        const productUrl = `/products/${productSlug}`;







  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Trending Products
            </h2>
            <p className="text-gray-600 mt-2">
              Most popular products this week
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors">
              View All
            </button>
            <div className="flex space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:border-blue-600">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:border-blue-600">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group"
            >
              <div className="relative">
                <div
                  className={`${product.imageColor} h-48 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="text-4xl">🛒</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {product.vendor}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-gray-900">
                          {product.selePrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.price}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Mock icon components
const ChevronLeft = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);