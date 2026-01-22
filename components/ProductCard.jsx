// components/ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const calculateDiscount = () => {
    if (product.discount?.type === 'percentage') {
      return `${product.discount.value}% OFF`;
    } else if (product.discount?.type === 'fixed') {
      return `₹${product.discount.value} OFF`;
    }
    return null;
  };

  const getPrice = () => {
    if (product.salePrice && product.salePrice < product.regularPrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.salePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{product.regularPrice.toLocaleString()}
          </span>
          {calculateDiscount() && (
            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
              {calculateDiscount()}
            </span>
          )}
        </div>
      );
    }
    return (
      <span className="text-lg font-bold text-gray-900">
        ₹{product.regularPrice.toLocaleString()}
      </span>
    );
  };

  const renderStockStatus = () => {
    if (product.stock === 0) {
      return <span className="text-xs text-red-600">Out of Stock</span>;
    } else if (product.stock < 10) {
      return <span className="text-xs text-orange-600">Low Stock</span>;
    }
    return <span className="text-xs text-green-600">In Stock</span>;
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {calculateDiscount() && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {calculateDiscount()}
            </div>
          )}
          
          {/* Type Badge */}
          {product.type !== 'regular' && (
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                product.type === 'featured' ? 'bg-blue-500 text-white' :
                product.type === 'new' ? 'bg-green-500 text-white' :
                'bg-purple-500 text-white'
              }`}>
                {product.type === 'best-selling' ? 'Best Seller' : product.type}
              </span>
            </div>
          )}
          
          {/* Free Delivery Badge */}
          {product.freeDelivery && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Free Delivery
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
          
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10">
            {product.name}
          </h3>
          
          {/* Brand */}
          <div className="text-xs text-gray-700 mb-2">Brand: {product.brand}</div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-3">{getPrice()}</div>
          
          {/* Stock & Sold */}
          <div className="flex justify-between items-center text-xs">
            <div>
              {renderStockStatus()} • {product.stock} left
            </div>
            <div className="text-gray-500">
              {product.sold || 0} sold
            </div>
          </div>
          
          {/* Variants Preview */}
          {product.variants?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Available in:</div>
              <div className="flex flex-wrap gap-1">
                {product.variants.slice(0, 3).map((variant, index) => (
                  <div
                    key={index}
                    className="text-xs border border-gray-200 px-2 py-1 rounded"
                    title={`${variant.color} ${variant.size ? `- ${variant.size}` : ''}`}
                  >
                    {variant.color}
                  </div>
                ))}
                {product.variants.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{product.variants.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;