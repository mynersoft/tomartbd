'use client';

import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import ProductQuickView from './ProductQuickView';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const ProductCardNew = ({ product }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const hasVariants = product.variants.length > 0;

  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);
  console.log(cart);

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isAddToCart = cart.some((item) => item._id === product._id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // ✅ Add to cart (FIXED)
  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
    setIsAddedToCart(true);
    toast.success('Added to cart!');
  };

  const productSlug = product.slug || product._id;
  const productUrl = `/product/${productSlug}`;

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

          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
              -{hasVariants
                ? product.variants[0].discount.value
                : product.discount.value}
              %
            </span>
          </div>

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
              <img
                src={ hasVariants
                ? product.variants[0].images[0]
                :  product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}

          <div className="mb-4">
            <span className="text-lg font-bold text-gray-900">
              {/* If product has variants, use first variant's price, otherwise use salePrice or product price */}
              {hasVariants
                ? product.variants[0].salePrice
                : product.salePrice || product.price}
              tk
            </span>

            <span className="ml-2 text-base text-gray-500 line-through">
              {hasVariants ? product.variants[0].price : product.price} tk
            </span>
          </div>

          {/* Quantity + Cart + View*/}

          <div className="flex h-8 items-center justify-between gap-3">
            {/* Quick View */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center  w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-700 hover:text-gray-700 hover:bg-gray-50  transition cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Quantity Control */}
            <div className="flex items-center   h-8 border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className=" flex items-center h-full px-2 justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
              >
                −
              </button>

              <span className=" text-center px-2  font-medium select-none">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className=" flex items-center h-full  px-2 cursor-pointer  justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 px-6 rounded-full font-medium transition  h-full cursor-pointer ${
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
