"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "react-hot-toast";
import { Star, Truck, Shield, RefreshCw, Check, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductSinglePage({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // Calculate discount price
  const discountPrice = product.discount 
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      product, 
      quantity,
      variant: selectedVariant 
    }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product));
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on our store!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Sample product data structure
  const productData = {
    ...product,
    images: product.images || [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
    ],
    variants: product.variants || [
      { id: 1, name: '4GB+64GB', color: 'Black' },
      { id: 2, name: '6GB+128GB', color: 'Blue' },
      { id: 3, name: '8GB+256GB', color: 'Silver' },
    ],
    specifications: product.specifications || [
      { label: 'Brand', value: product.brand || 'Generic' },
      { label: 'Model', value: '2023 Edition' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'Color', value: 'Various' },
    ],
    ratings: product.ratings || {
      average: 4.5,
      total: 1247,
      breakdown: [450, 300, 200, 150, 147]
    },
    reviews: product.reviews || [
      { id: 1, user: 'John D.', rating: 5, date: '2024-01-15', comment: 'Excellent product! Fast delivery.', verified: true },
      { id: 2, user: 'Sarah M.', rating: 4, date: '2024-01-10', comment: 'Good quality but packaging could be better.', verified: true },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/categories" className="hover:text-blue-600">Electronics</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/categories/smartphones" className="hover:text-blue-600">Smartphones</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="border rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img
                    src={productData.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 border rounded-lg overflow-hidden ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="w-20 h-20 bg-gray-50 flex items-center justify-center">
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-600">Dhaka, Chittagong & 3 other cities</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Warranty</p>
                    <p className="text-sm text-gray-600">1 Year Brand Warranty</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">7 Days Return</p>
                    <p className="text-sm text-gray-600">Change of mind is applicable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Brand & SKU */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>Brand: <span className="font-medium">{product.brand || 'Generic'}</span></span>
                  <span>SKU: <span className="font-medium">{product.sku || 'N/A'}</span></span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(productData.ratings.average)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-blue-600 font-medium">
                      {productData.ratings.average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({productData.ratings.total} Ratings)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-green-600 font-medium">
                    {Math.floor(Math.random() * 5000) + 1000} Sold
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="border-t border-b py-6">
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-red-600">
                      ৳{formatPrice(discountPrice)}
                    </span>
                    {product.discount && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ৳{formatPrice(product.price)}
                        </span>
                        <span className="text-red-600 font-bold">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                  
                  {product.discount && (
                    <div className="text-sm text-gray-600">
                      You save: ৳{formatPrice(product.price - discountPrice)}
                    </div>
                  )}

                  {/* Installment Option */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">
                      🏦 0% EMI Available
                    </p>
                    <p className="text-sm text-gray-600">
                      EMI starts at ৳{formatPrice(discountPrice / 6)}/month
                    </p>
                  </div>
                </div>
              </div>

              {/* Variants Selection */}
              {productData.variants && productData.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Select Variant:</h3>
                  <div className="flex flex-wrap gap-2">
                    {productData.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-3 border rounded-lg flex items-center space-x-2 ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {selectedVariant?.id === variant.id && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                        <span>{variant.name}</span>
                        {variant.color && (
                          <span className="text-gray-600">({variant.color})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border-r text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border-l text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {product.stock || 100} pieces available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-3 border rounded-lg flex items-center space-x-2 ${
                    isWishlisted
                      ? 'border-red-500 text-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                  <span>{isWishlisted ? 'Saved' : 'Save for Later'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 border border-gray-300 rounded-lg flex items-center space-x-2 hover:border-gray-400"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-6 bg-white rounded-lg shadow-sm">
          {/* Tab Headers */}
          <div className="border-b">
            <nav className="flex -mb-px">
              {['description', 'specifications', 'reviews', 'seller'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm border-b-2 ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700">
                  {product.description || "No description available."}
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li>✅ High-quality materials</li>
                  <li>✅ 1-year manufacturer warranty</li>
                  <li>✅ Free delivery on orders above ৳500</li>
                  <li>✅ 7-day return policy</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.specifications.map((spec, index) => (
                    <div key={index} className="flex border-b pb-2">
                      <span className="w-1/3 text-gray-600">{spec.label}</span>
                      <span className="w-2/3 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-start space-x-8">
                  {/* Rating Summary */}
                  <div className="w-1/3">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {productData.ratings.average.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(productData.ratings.average)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">
                        {productData.ratings.total} Ratings
                      </p>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star, index) => (
                      <div key={star} className="flex items-center space-x-3 mb-2">
                        <span className="w-10 text-gray-600">{star} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${(productData.ratings.breakdown[index] / productData.ratings.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="w-10 text-gray-600 text-sm">
                          {productData.ratings.breakdown[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {productData.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.user}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-300 text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Official Store</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600">● 98% Positive Seller Ratings</span>
                        <span>|</span>
                        <span>⭐ 4.8/5</span>
                        <span>|</span>
                        <span>📦 On-time Delivery: 97%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl">⏰</div>
                      <p className="text-sm mt-1">Usually ships within 24 hours</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl">📞</div>
                      <p className="text-sm mt-1">Chat Response Rate: 95%</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl">🔄</div>
                      <p className="text-sm mt-1">7 Days Return</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl">🏆</div>
                      <p className="text-sm mt-1">Top Rated Seller</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">You may also like</h2>
            <Link href="/related-products" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-3">
                  <span className="text-gray-400">Product {i}</span>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 mb-2">
                  Related Product {i} Name Here
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold">৳{formatPrice(9999 + i * 1000)}</span>
                  <span className="text-gray-400 text-sm line-through">৳{formatPrice(12999 + i * 1000)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-600 font-bold text-lg">
                ৳{formatPrice(discountPrice)}
              </div>
              {product.discount && (
                <div className="text-gray-400 text-sm line-through">
                  ৳{formatPrice(product.price)}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}