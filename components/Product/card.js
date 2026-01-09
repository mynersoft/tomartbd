import './App.css'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye, 
  RefreshCw,
  Truck,
  Shield
} from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Calculate discount percentage
  const discountPercentage = product.discount ? 
    Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100) : 
    0;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image Section */}
      <div className="relative overflow-hidden bg-gray-50">
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Quick View Button (appears on hover) */}
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 font-medium px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800 hover:text-white z-10 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Quick View
        </button>

        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-2">
          <span className="text-sm text-gray-500 font-medium">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center">
            {/* Discount Price */}
            {product.discountPrice ? (
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.discountPrice)}
              </span>
            ) : null}

            {/* Regular Price */}
            <span
              className={`ml-2 ${
                product.discountPrice
                  ? 'text-lg text-gray-500 line-through'
                  : 'text-2xl font-bold text-gray-900'
              }`}
            >
              {formatPrice(product.regularPrice)}
            </span>
          </div>

          {/* Savings */}
          {product.discountPrice && (
            <div className="mt-1">
              <span className="text-sm text-green-600 font-medium">
                Save {formatPrice(product.regularPrice - product.discountPrice)}
              </span>
            </div>
          )}
        </div>

       

        {/* Quantity & Add to Cart */}
        <div className="flex #b80e0e-center space-x-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 py-2 w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => setIsAddedToCart(true)}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg font-medium transition-all duration-200 ${
              isAddedToCart
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className={`w-5 h-5 mr-2 ${isAddedToCart ? 'animate-bounce' : ''}`} />
            {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>

        {/* Stock Status */}
        <div className="mt-4">
          {product.stock > 0 ? (
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (product.stock / product.initialStock) * 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 ml-3">
                {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Example product data
const sampleProduct = {
  id: 1,
  name: "Wireless Noise-Canceling Headphones",
  category: "Electronics",
  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  regularPrice: 299.99,
  discountPrice: 229.99,
  rating: 4.5,
  reviewCount: 128,
  stock: 8,
  initialStock: 50,
};

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Premium Product Collection</h1>
          <p className="text-gray-600 text-lg">Discover our exclusive range of high-quality products</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <ProductCard product={sampleProduct} />
          
          {/* Additional product examples */}
          <ProductCard product={{
            ...sampleProduct,
            id: 2,
            name: "Smart Fitness Watch with GPS",
            category: "Wearables",
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            regularPrice: 249.99,
            discountPrice: null,
            rating: 4.2,
            reviewCount: 89,
            stock: 15,
          }} />
          
          <ProductCard product={{
            ...sampleProduct,
            id: 3,
            name: "Professional DSLR Camera Kit",
            category: "Photography",
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80",
            regularPrice: 1299.99,
            discountPrice: 999.99,
            rating: 4.8,
            reviewCount: 256,
            stock: 3,
          }} />
          
          <ProductCard product={{
            ...sampleProduct,
            id: 4,
            name: "Ultra-Thin Laptop 16GB RAM",
            category: "Computers",
            imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            regularPrice: 1599.99,
            discountPrice: 1399.99,
            rating: 4.7,
            reviewCount: 342,
            stock: 12,
          }} />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Hover over cards to see quick view. Click wishlist, adjust quantity, and add to cart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;