"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "react-hot-toast";
import { Star, Truck, Shield, RefreshCw, Check, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductSinglePage() {
  const dispatch = useDispatch();
  const { slug } = useParams(); // get slug from URL

  // Redux store
  const products = useSelector((state) => state.products.products);
  const wishlist = useSelector((state) => state.wishlist.items);

  // Filter product by slug
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

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
    // Navigate to checkout if needed
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

  // Fallback data
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
                  {product.discount && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
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

              {/* Variants, Quantity, Action Buttons, Tabs, Reviews etc. */}
              {/* ...rest of your UI code remains unchanged, it will use `product` from Redux ... */}

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}