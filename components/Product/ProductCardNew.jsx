'use client';

import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import ProductQuickView from './ProductQuickView';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

const ProductCardNew = ({ product }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const hasVariants = product?.variants?.length > 0;

  // Get the correct image source
  const getImageSrc = () => {
    if (!product) return '/placeholder.png';

    if (hasVariants && product.variants[0]?.images?.[0]) {
      return product.variants[0].images[0];
    }

    if (product.images?.[0]) {
      return product.images[0];
    }

    return '/placeholder.png';
  };

  const imgSrc = getImageSrc();

  const wishlist = useSelector((state) => state.wishlist.items || []);
  const cart = useSelector((state) => state.cart.items || []);

  const isWishlisted = wishlist.some((item) => item._id === product?._id);
  const isAddToCart = cart.some((item) => item._id === product?._id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Add to cart
  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!product) {
      toast.error('Product not available');
      return;
    }

    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
    setIsAddedToCart(true);
    toast.success('Added to cart!');
  };

  const productSlug = product?.slug || product?._id || '';
  const productUrl = `/product/${productSlug}`;

  // Get discount value safely
  const getDiscountValue = () => {
    if (!product) return null;

    if (hasVariants && product.variants[0]?.discount?.value > 0) {
      return product.variants[0].discount.value;
    }

    if (product.discount?.value > 0) {
      return product.discount.value;
    }

    return null;
  };

  const discountValue = getDiscountValue();

  // Get price info safely
  const getPriceInfo = () => {
    if (!product) {
      return { hasDiscount: false, regularPrice: 0, salePrice: 0 };
    }

    let hasDiscount = false;
    let regularPrice = 0;
    let salePrice = 0;

    if (hasVariants && product.variants?.[0]) {
      const variant = product.variants[0];
      regularPrice = variant.price || 0;
      salePrice = variant.salePrice || variant.price || 0;
      hasDiscount = variant.discount?.value > 0;
    } else {
      regularPrice = product.regularPrice || product.price || 0;
      salePrice =
        product.salePrice || product.regularPrice || product.price || 0;
      hasDiscount = product.discount?.value > 0;
    }

    return { hasDiscount, regularPrice, salePrice };
  };

  const { hasDiscount, regularPrice, salePrice } = getPriceInfo();

  // Get stock safely
  const getStock = () => {
    if (!product) return 0;

    if (hasVariants && product.variants?.[0]?.stock !== undefined) {
      return product.variants[0].stock;
    }

    return product.stock || 0;
  };

  const stock = getStock();

  // Safely get rating
  const rating = product?.rating || 0;
  const reviewCount = product?.reviewCount || 0;

  if (!product) return null;

  return (
    <>
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

      <div className="group bg-white w-full rounded-xl shadow-md hover:shadow transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Product Image Section */}
        <div className="relative overflow-hidden bg-gray-50">
          {/* Discount Badge */}
          {discountValue !== null && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
                -{discountValue}% OFF
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggle}
            className="absolute top-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Image */}
          <Link href={productUrl}>
            <div className="h-[220px] w-full overflow-hidden relative duration-500">
              <Image
                src={imgSrc}
                alt={product.name || 'Product image'}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {rating} ({reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-4 flex justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {salePrice} tk
              </span>

              {hasDiscount && salePrice < regularPrice && (
                <span className="ml-2 text-base text-gray-500 line-through">
                  {regularPrice} tk
                </span>
              )}
            </div>

            <span className="text-center px-2 font-medium select-none">
              Stock {stock}
            </span>
          </div>

          {/* Quantity + Cart + View */}
          <div className="flex h-8 items-center justify-between gap-3">
            {/* Quick View */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-700 hover:text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Quantity Control */}
            <div className="flex items-center h-8 border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center h-full px-2 justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
              >
                −
              </button>

              <span className="text-center px-2 font-medium select-none">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center h-full px-2 cursor-pointer justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 px-6 rounded-full font-medium transition h-full cursor-pointer ${
                isAddToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCardNew;
