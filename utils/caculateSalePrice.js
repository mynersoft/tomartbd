export function calculateSalePrice({
  regularPrice,
  variantPrice = null,
  discount = null,
}) {
  // base price decide
  const basePrice = variantPrice ?? regularPrice;

  // no discount → regular price = sale price
  if (!discount || !discount.type || !discount.value) {
    return regularPrice;
  }

  let salePrice = basePrice;

  if (discount.type === 'percentage') {
    salePrice = basePrice - (basePrice * discount.value) / 100;
  }

  if (discount.type === 'fixed') {
    salePrice = basePrice - discount.value;
  }

  // never negative
  return Math.max(Math.round(salePrice), 0);
}