"use client";

import Image from "next/image";


export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-50 w-[95%] max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          x
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h2>

            <p className="mt-2 text-xl font-bold text-primary">
              ৳ {product.price}
            </p>

            {product.shortDescription && (
              <p className="mt-4 text-sm text-gray-600">
                {product.shortDescription}
              </p>
            )}

            <button
              onClick={() => onAddToCart(product._id)}
              className="mt-auto rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}