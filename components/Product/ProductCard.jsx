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
      {/* Quick View Modal */}
      {open && (
        <ProductQuickView
          product={product}
          onClose={() => setOpen(false)}
          onAddToCart={() => {
            handleAddToCart();
            setOpen(false);
          }}
        />
      )}

      <div className="bg-white shadow rounded overflow-hidden flex flex-col hover:shadow-lg transition group">
        {/* Image */}
        <div className="h-48 bg-gray-100 relative flex items-center justify-center">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain p-2 group-hover:scale-105 transition"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}

          {/* Discount */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={handleToggle}
            className={`absolute top-2 right-2 p-1 rounded-full shadow ${
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
          <h3 className="font-semibold text-lg line-clamp-2">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-sm text-gray-500">{product.brand}</p>
          )}

          {/* Price */}
          <div className="mt-2 mb-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-xl">
                  {formatPrice(discountPrice)} ৳
                </span>
                <span className="line-through text-gray-400 text-sm">
                  {formatPrice(product.price)} ৳
                </span>
              </div>
            ) : (
              <span className="text-blue-600 font-bold text-xl">
                {formatPrice(product.price)} ৳
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="text-yellow-400 text-sm mb-2">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200"
            >
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}