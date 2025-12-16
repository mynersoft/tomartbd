"use client";

import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import ProductQuickView from "./ProductQuickView";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const [open, setOpen] = useState(false);

  // ✅ Calculate discount price
  const calculateDiscountPrice = () => {
    if (product.discount && product.discount > 0) {
      return (product.price * (100 - product.discount)) / 100;
    }
    return product.price;
  };

  // ✅ Format price with commas
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const discountPrice = calculateDiscountPrice();
  const hasDiscount = product.discount && product.discount > 0;

  // ✅ Open quick view
  const handleQuickView = () => {
    setOpen(true);
  };

  // ✅ Close quick view
  const handleCloseQuickView = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    dispatch(toggleWishlist(product));
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product }));
    toast.success("Added to cart!");
  };

  return (
    <>
      {/* ✅ Render modal only when open */}
      {open && (
        <ProductQuickView
          product={product}
          onClose={handleCloseQuickView}
          onAddToCart={() => {
            handleAddToCart();
            setOpen(false);
          }}
        />
      )}

      <div className="bg-white shadow rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 group">
        {/* Image */}
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-contain h-full w-full p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{product.discount}%
            </div>
          )}

          <button
            onClick={handleToggle}
            className={`absolute top-2 right-2 p-1 rounded-full shadow transition ${
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white hover:bg-red-100"
            }`}
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
          )}

          {/* Price Section */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-red-600">
                  {formatPrice(discountPrice)} ৳
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price)} ৳
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                  Save {product.discount}%
                </span>
              </div>
            ) : (
              <span className="font-bold text-xl text-blue-600">
                {formatPrice(product.price)} ৳
              </span>
            )}
          </div>

          {/* Additional product info (optional) */}
          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.rating})
              </span>
            </div>
          )}

          <div className="mt-auto flex gap-2">
            <button
              onClick={handleQuickView}
              className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition border border-gray-300"
            >
              Quick View
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}