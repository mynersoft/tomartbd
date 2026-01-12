'use client';

import {
  X,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Tag,
  Truck,
  Shield,
  Package,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import ProductRating from './ProductRating';
import PriceDisplay from './PriceDisplay';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import FeatureCard from './FeatureCard';

export default function ProductQuickView({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const isWishlisted = product
    ? wishlist.some((item) => item._id === product._id)
    : false;

  // Get unique colors and sizes from variants
  const colors = [
    ...new Set(product?.variants?.map((v) => v.color).filter(Boolean) || []),
  ];
  const sizes = [
    ...new Set(product?.variants?.map((v) => v.size).filter(Boolean) || []),
  ];

  // Get current price information
  const getPriceInfo = () => {
    if (!product) return { salePrice: 0, regularPrice: 0, discountValue: 0 };

    const hasVariants = product.variants?.length > 0;
    let salePrice,
      regularPrice,
      discountValue = 0;

    if (hasVariants && product.variants?.[0]) {
      const variant = product.variants[0];
      regularPrice = variant.price || 0;
      salePrice = variant.salePrice || variant.price || 0;
      discountValue = variant.discount?.value || 0;
    } else {
      regularPrice = product.regularPrice || product.price || 0;
      salePrice =
        product.salePrice || product.regularPrice || product.price || 0;
      discountValue = product.discount?.value || 0;
    }

    return { salePrice, regularPrice, discountValue, hasVariants };
  };

  const { salePrice, regularPrice, discountValue, hasVariants } =
    getPriceInfo();

  // Get current image
  const getCurrentImage = () => {
    if (!product) return '/placeholder.png';

    // If product has images
    if (product.images?.[selectedImage]) {
      return product.images[selectedImage];
    }

    // Fallback to first image or placeholder
    return (
      product.images?.[0] ||
      product.variants?.[0]?.images?.[0] ||
      '/placeholder.png'
    );
  };

  const currentImage = getCurrentImage();

  // Event handlers
  const handlePreviousImage = () => {
    const totalImages = product?.images?.length || 0;
    setSelectedImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const totalImages = product?.images?.length || 0;
    setSelectedImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleAddToCartLocal = () => {
    if (!product) {
      toast.error('Product not available');
      return;
    }

    const itemToAdd = {
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    };

    dispatch(addToCart(itemToAdd));

    if (onAddToCart) {
      onAddToCart(itemToAdd);
    }

    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard event for ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  const totalImages = product.images?.length || 0;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
            aria-label="Close quick view"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-full max-h-[500px] aspect-square overflow-hidden rounded-2xl bg-gray-50 group">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Navigation Arrows */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {discountValue > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-linear-to-r from-red-500 to-red-600 text-white font-bold text-sm rounded-full shadow-lg">
                      -{discountValue}%
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnail Images */}
              {totalImages > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative w-full h-full bg-gray-100">
                        <Image
                          src={img}
                          alt={`${product.name} - view ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center justify-between mb-3">
                  <ProductRating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                  <span className="text-green-600 font-medium">
                    Stock: {product.stock || 0}
                  </span>
                </div>

                {/* SKU */}
                {product.sku && (
                  <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                )}
              </div>

              {/* Price Display */}
              <PriceDisplay
                salePrice={salePrice}
                regularPrice={regularPrice}
                discountValue={discountValue}
                hasVariants={hasVariants}
              />

              {/* Color & Size Selectors */}
              {colors.length > 0 && (
                <ColorSelector
                  colors={colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              )}

              {sizes.length > 0 && (
                <SizeSelector
                  sizes={sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                />
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />

                  <button
                    onClick={handleAddToCartLocal}
                    className="flex-1 flex items-center justify-center gap-3 bg-linear-to-r from-gray-900 to-gray-800 text-white py-4 px-8 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <FeatureCard
                    icon={Truck}
                    title="Free Shipping"
                    subtitle="Over ৳1000"
                    colorClass="text-blue-500"
                  />
                  <FeatureCard
                    icon={Shield}
                    title="2 Year Warranty"
                    subtitle="Full Coverage"
                    colorClass="text-green-500"
                  />
                  <FeatureCard
                    icon={Package}
                    title="Easy Returns"
                    subtitle="30 Day Policy"
                    colorClass="text-purple-500"
                  />
                  <FeatureCard
                    icon={Tag}
                    title="Best Price"
                    subtitle="Guaranteed"
                    colorClass="text-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
