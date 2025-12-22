"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Tag, 
  Star, 
  ArrowRight,
  Package,
  ChevronRight
} from "lucide-react";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success("Added to cart");
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#f8f5ec] flex items-center justify-center">
            <Heart size={48} className="text-[#C0A460]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Save your favorite items here to easily find them later. Start exploring our collection!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#004488] text-white px-8 py-3 rounded-lg hover:bg-[#003366] transition-all font-medium shadow-sm"
          >
            <ShoppingCart size={20} />
            Start Shopping
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#C0A460] text-[#C0A460] px-8 py-3 rounded-lg hover:bg-[#f8f5ec] transition-all font-medium"
          >
            <Eye size={20} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f8f5ec] rounded-lg">
            <Heart className="text-[#C0A460]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <span className="bg-[#004488] text-white px-2 py-1 rounded text-xs font-medium">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
              Your saved favorites
            </p>
          </div>
        </div>
        
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[#004488] hover:text-[#003366] font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="text-[#004488]" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f8f5ec] rounded-lg">
              <Tag className="text-[#C0A460]" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Discounted Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {wishlist.filter(item => item.discount > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Star className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {wishlist.length > 0 
                  ? (wishlist.reduce((sum, item) => sum + (item.rating || 4), 0) / wishlist.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    Product Details
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((product) => {
                const finalPrice = product.discount
                  ? (product.price * (100 - product.discount)) / 100
                  : product.price;
                const savings = product.discount 
                  ? product.price - finalPrice 
                  : 0;

                return (
                  <tr 
                    key={product._id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                          <img
                            src={product.images?.[0] || "/default-image.png"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(product.rating || 4) 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.ratingCount || "No"} reviews)
                            </span>
                          </div>
                          
                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {product.tags.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{product.tags.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-[#004488]">
                            ৳{finalPrice.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                        
                        {product.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ৳{product.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-green-600 font-medium mt-1">
                              Save ৳{savings.toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          product.inStock 
                            ? "bg-green-500" 
                            : "bg-red-500"
                        }`} />
                        <span className={`font-medium ${
                          product.inStock 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      {product.inStock && (
                        <p className="text-xs text-gray-500 mt-1">
                          {product.stock || "Limited"} units available
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            product.inStock
                              ? "bg-[#004488] text-white hover:bg-[#003366]"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="flex-1 flex items-center justify-center gap-2 border border-[#C0A460] text-[#C0A460] px-3 py-2 rounded-lg hover:bg-[#f8f5ec] transition-colors text-sm"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <button
                            onClick={() => handleRemove(product._id)}
                            className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {wishlist.map((product) => {
            const finalPrice = product.discount
              ? (product.price * (100 - product.discount)) / 100
              : product.price;
            const savings = product.discount 
              ? product.price - finalPrice 
              : 0;

            return (
              <div key={product._id} className="p-4 border-b border-gray-100">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                    <img
                      src={product.images?.[0] || "/default-image.png"}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 my-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < Math.floor(product.rating || 4) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#004488]">
                          ৳{finalPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ৳{product.price.toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          Save ৳{savings.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium ${
                          product.inStock
                            ? "bg-[#004488] text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-2 border border-[#C0A460] text-[#C0A460] px-3 py-2 rounded-lg"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions */}
      {wishlist.length > 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-gray-600">
                Manage your wishlist items in bulk
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  wishlist.forEach(product => {
                    if (product.inStock) {
                      handleAddToCart(product);
                    }
                  });
                  toast.success("Added all available items to cart");
                }}
                className="inline-flex items-center gap-2 bg-[#004488] text-white px-5 py-2.5 rounded-lg hover:bg-[#003366] transition-colors font-medium"
              >
                <ShoppingCart size={18} />
                Add All to Cart
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 border-2 border-[#C0A460] text-[#C0A460] px-5 py-2.5 rounded-lg hover:bg-[#f8f5ec] transition-colors font-medium"
              >
                Go to Cart
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="text-[#004488]" size={20} />
            </div>
            <h3 className="font-bold text-gray-900">About Wishlist</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#004488] mt-1.5 flex-shrink-0" />
              Save items you love for later
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#004488] mt-1.5 flex-shrink-0" />
              Get notified when prices drop
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#004488] mt-1.5 flex-shrink-0" />
              Track item availability
            </li>
          </ul>
        </div>

        <div className="bg-[#f8f5ec] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg">
              <Tag className="text-[#C0A460]" size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Special Offers</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Items in your wishlist may go on sale! We'll notify you if prices change.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="px-2 py-1 bg-[#C0A460] text-white rounded text-xs font-medium">
              PRO TIP
            </div>
            <span className="text-gray-600">Move items to cart before they sell out</span>
          </div>
        </div>
      </div>
    </div>
  );
}