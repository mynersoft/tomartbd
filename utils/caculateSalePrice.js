export function calculateSalePrice({
  regularPrice,
  discount,
  variantPrice = null,
}) {
  let basePrice = variantPrice ?? regularPrice;

  if (!discount || !discount.value) {
    return basePrice;
  }

  if (discount.type === 'percentage') {
    return basePrice - (basePrice * discount.value) / 100;
  }

  if (discount.type === 'fixed') {
    return basePrice - discount.value;
  }

  return basePrice;
}