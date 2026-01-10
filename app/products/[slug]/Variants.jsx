"use client";

import { useEffect, useState } from "react";

export default function Variants({
  productData,
  selectedVariant,
  onVariantSelect,
}) {
  const variants = productData?.variants || [];

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = selectedVariant
    ? [...new Set(
        variants
          .filter(v => v.size === selectedVariant.size)
          .map(v => v.color)
      )]
    : [];

  const [size, setSize] = useState(selectedVariant?.size || null);
  const [color, setColor] = useState(selectedVariant?.color || null);

  useEffect(() => {
    if (size && color) {
      const found = variants.find(
        v => v.size === size && v.color === color
      );
      if (found) onVariantSelect(found);
    }
  }, [size, color]);

  return (
    <div className="space-y-6">
      {/* PRICE */}
      <div className="text-2xl font-bold text-green-600">
        ৳ {selectedVariant?.price || productData.price}
      </div>

      {/* SIZE */}
      <div>
        <p className="font-semibold mb-2">Size</p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setColor(null);
              }}
              className={`px-4 py-2 rounded-lg border
                ${size === s
                  ? "bg-black text-white border-black"
                  : "border-gray-300 hover:border-black"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      {size && (
        <div>
          <p className="font-semibold mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-lg border
                  ${color === c
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:border-black"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STOCK */}
      {selectedVariant && (
        <p className={`text-sm font-medium
          ${selectedVariant.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {selectedVariant.stock > 0
            ? `In stock (${selectedVariant.stock})`
            : "Out of stock"}
        </p>
      )}
    </div>
  );
}