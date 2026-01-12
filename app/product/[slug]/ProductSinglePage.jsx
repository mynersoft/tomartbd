'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import ReviewForm from '@/components/ReviewForm';
import ProductQuestions from '@/components/Product/ProductQuestions';
import { formatCurrency } from '@/utils/formatCurrency';
import { toast } from 'react-hot-toast';
import {
  Star,
  Truck,
  Shield,
  X,
  RefreshCw,
  Check,
  Share2,
  Heart,
  ShoppingCart,
  ChevronRight,
  Package,
  Award,
  Clock,
  Users,
  ChevronLeft,
  MessageSquare,
  Minus,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import Variants from './Variants';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import TabContent from './TabContent';

export default function ProductSinglePage() {
  useProducts();
  const products = useSelector((state) => state.product.products);

  const [product, setProduct] = useState(null);
  console.log(product);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = useParams();

  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = () => {
      try {
        setLoading(true);

        if (!products || products.length === 0) {
          console.log('No products available yet');
          return;
        }

        if (slug) {
          // Try to find product by slug
          const foundProduct = products.find((item) => item.slug === slug);

          if (foundProduct) {
            setProduct(foundProduct);
            console.log('Product found:', foundProduct.name);

            // Set default variant if exists
            if (foundProduct.variants && foundProduct.variants.length > 0) {
              setSelectedVariant(foundProduct.variants[0]);
            }
            setError(null);
          } else {
            console.log('Product not found for slug:', slug);
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure products are loaded
    const timer = setTimeout(loadProduct, 100);

    return () => clearTimeout(timer);
  }, [products, slug]);

  // Helper functions to get product data
  const getProductImages = () => {
    if (!product) return [];

    // Return variant images if selected variant exists, otherwise product images
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      return selectedVariant.images;
    }

    if (product.images && product.images.length > 0) {
      return product.images;
    }

    return ['/placeholder.png'];
  };

  const getProductPrice = () => {
    if (!product) return { regular: 0, sale: 0 };

    if (selectedVariant && selectedVariant.price !== undefined) {
      const salePrice = selectedVariant.salePrice || selectedVariant.price;
      const regularPrice =
        selectedVariant.regularPrice || selectedVariant.price;
      return { regular: regularPrice, sale: salePrice };
    }

    return {
      regular: product.regularPrice || product.price || 0,
      sale: product.salePrice || product.price || 0,
    };
  };

  const getProductDiscount = () => {
    const prices = getProductPrice();
    if (prices.regular > 0 && prices.sale < prices.regular) {
      const discountPercent =
        ((prices.regular - prices.sale) / prices.regular) * 100;
      return Math.round(discountPercent);
    }
    return 0;
  };

  const isWishlisted = wishlist.some((item) => item._id === product?._id);

  const handleAddToCart = () => {
    if (!product) {
      toast.error('Product not available');
      return;
    }

    const itemToAdd = {
      ...product,
      variant: selectedVariant,
      selectedVariant: selectedVariant, // Include selected variant
    };

    dispatch(
      addToCart({
        product: itemToAdd,
        quantity,
        variant: selectedVariant,
      })
    );
    toast.success('🎉 Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product) {
      toast.error('Product not available');
      return;
    }

    handleAddToCart();
    router.push('/cart');
  };

  const handleWishlistToggle = () => {
    if (!product) {
      toast.error('Product not available');
      return;
    }

    dispatch(toggleWishlist(product));
    toast.success(
      isWishlisted ? '❤️ Removed from wishlist' : '💝 Added to wishlist'
    );
  };

  const handleShare = async () => {
    if (!product) return;

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
      toast.success('🔗 Link copied to clipboard!');
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Reset selected image when variant changes
    setSelectedImage(0);
  };

  // Get current stock based on variant or product
  const getCurrentStock = () => {
    if (selectedVariant && selectedVariant.stock !== undefined) {
      return selectedVariant.stock;
    }
    return product?.stock || 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Package className="w-20 h-20 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {error || 'Product Not Found'}
          </h2>
          <p className="text-gray-600 text-lg">
            {error === 'Failed to load product'
              ? 'Failed to load product details. Please try again later.'
              : "The product you're looking for doesn't exist or has been moved."}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Get current data
  const images = getProductImages();
  const prices = getProductPrice();
  const discountPercent = getProductDiscount();
  const mainImage = images[selectedImage] || '/placeholder-product.jpg';
  const hasVariants = product.variants && product.variants.length > 0;
  const currentStock = getCurrentStock();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/categories"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image Container */}
              <div className="relative border-2 border-gray-100 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <div className="aspect-square flex items-center justify-center p-8">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
                    priority
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discountPercent > 0 && (
                      <span className="bg-gradient-to-r flex justify-center from-red-500 to-pink-500 text-white px-4 py-1 rounded-full w-12 text-sm font-bold shadow-lg">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Navigation Arrows - only if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev > 0 ? prev - 1 : images.length - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev < images.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? 'border-blue-500 ring-4 ring-blue-100 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-50 flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = '/placeholder-thumb.jpg';
                          }}
                        />
                      </div>
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-blue-500/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-medium text-gray-900 mb-3 leading-tight">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      {product.brand && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Brand: {product.brand}
                        </span>
                      )}
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-3 rounded-full transition-all ${
                        isWishlisted
                          ? 'bg-red-50 text-red-500 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Rating & Sales */}
                <div className="flex items-center flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {(product.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-50">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xl font-bold text-gray-900">
                      ৳ {prices.sale}
                    </span>

                    {prices.regular > prices.sale && (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-gray-400 line-through">
                          ৳ {prices.regular}
                        </span>
                        {discountPercent > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full font-bold">
                            Save {discountPercent}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {prices.regular > prices.sale && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <Check className="w-5 h-5" />
                        <span>You save ৳ {prices.regular - prices.sale}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {hasVariants && (
                <Variants
                  productData={product}
                  selectedVariant={selectedVariant}
                  onVariantSelect={setSelectedVariant}
                />
              )}

              {/* Quantity & Actions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="group bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:scale-[1.02]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Delivery & Services:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Truck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Free Delivery</p>
                        <p className="text-sm text-gray-600">Within 2-3 days</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          2 Year Warranty
                        </p>
                        <p className="text-sm text-gray-600">Full coverage</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <RefreshCw className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">14-Day Return</p>
                        <p className="text-sm text-gray-600">Easy returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TabContent
            product={product }
          />
        </div>
      </div>
    </div>
  );
}
