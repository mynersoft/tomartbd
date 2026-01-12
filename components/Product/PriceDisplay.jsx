const PriceDisplay = ({
  salePrice,
  regularPrice,
  discountValue,
  hasVariants,
}) => {
  const shouldShowDiscount = discountValue > 0 && regularPrice > salePrice;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gray-900">৳{salePrice}</span>

        {shouldShowDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ৳{regularPrice}
            </span>
            <span className="px-2 py-1 bg-red-50 text-red-600 font-semibold text-sm rounded">
              -{discountValue}% OFF
            </span>
          </>
        )}
      </div>

      {shouldShowDiscount && (
        <p className="text-green-600 font-medium">
          You save ৳{regularPrice - salePrice} ({discountValue}% off)
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
