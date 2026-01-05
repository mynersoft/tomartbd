import Voucher from '@/models/Voucher';
import { connectDB } from '@/lib/db';


/**
 * Validate & apply voucher
 * @param {Object} params
 * @param {String} params.voucherCode
 * @param {Array} params.cartItems
 * @param {Number} params.subtotal
 * @returns {Object}
 */
export const validateVoucher = async ({ voucherCode, cartItems, subtotal }) => {

  console.log(voucherCode,'-==================================');

  if (!voucherCode) {
    return { discount: 0, voucher: null };
  }

	connectDB();
  const voucher = await Voucher.findOne({ code: voucherCode });

  if (!voucher) {
    throw new Error('Invalid voucher code');
  }

  if (voucher.status !== 'active') {
    throw new Error('Voucher inactive');
  }

  const now = new Date();
  if (now < voucher.startDate || now > voucher.endDate) {
    throw new Error('Voucher expired or not started');
  }

  if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
    throw new Error(`Minimum order ${voucher.minOrderAmount} tk required`);
  }

  let discount = 0;

  /* ---------------------------
     🎯 Apply discount logic
  ---------------------------- */
  if (voucher.type === 'all-product') {
    if (voucher.discountType === 'percentage') {
      discount = (subtotal * voucher.discountValue) / 100;
    } else if (voucher.discountType === 'fixed') {
      discount = Math.min(voucher.discountValue, subtotal);
    }
  }

  if (voucher.type === 'product-specific') {
    const eligibleTotal = cartItems
      .filter((item) => voucher.applicableProducts.includes(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (eligibleTotal === 0) {
      throw new Error('No eligible products for this voucher');
    }

    if (voucher.discountType === 'percentage') {
      discount = (eligibleTotal * voucher.discountValue) / 100;
    } else if (voucher.discountType === 'fixed') {
      discount = Math.min(voucher.discountValue, eligibleTotal);
    }
  }

  discount = Math.min(discount, subtotal);

  return {
    discount,
    voucher: {
      code: voucher.code,
      name: voucher.name,
      type: voucher.type,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      discountApplied: discount,
    },
  };
};
