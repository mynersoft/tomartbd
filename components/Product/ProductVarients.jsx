"use client";

import { useEffect, useState } from "react";

export default function ProductVariants({ product, onVariantChange }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [variant, setVariant] = useState(null);

  const sizes = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Set(
    product.variants
      .filter(v => !selectedSize || v.size === selectedSize)
      .map(v => v.color)
  )];

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const found = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      setVariant(found || null);
      onVariantChange?.(found || null);
    }
  }, [selectedSize, selectedColor]);

  return (
    <div className="space-y-4">
      {/* PRICE */}
      <div className="text-2xl font-bold text-green-600">
        ৳ {variant?.price || product.price}
      </div>

      {/* SIZE */}
      <div>
        <p className="mb-2 font-medium">Size</p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                setSelectedColor(null);
              }}
              className={`px-4 py-2 border rounded-md text-sm
                ${selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      {selectedSize && (
        <div>
          <p className="mb-2 font-medium">Color</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-md text-sm
                  ${selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STOCK */}
      {variant && (
        <p className={`text-sm ${variant.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {variant.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
      )}
    </div>
  );
}