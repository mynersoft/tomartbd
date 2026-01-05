// app/api/voucher/apply/route.js
import { NextResponse } from 'next/server';
import { validateVoucher } from '@/lib/validateVoucher';

export async function POST(req) {
  try {
    const body = await req.json();

    const { voucher, cartItems, subtotal } = body;
    const { discount } = await validateVoucher({
      voucherCode: voucher ,
      cartItems,
      subtotal,
    });

    return NextResponse.json({
      success: true,
      // voucher: {
      //   code: voucherData.code,
      //   name: voucherData.name,
      //   type: voucherData.type,
      //   discountType: voucherData.discountType,
      //   discountValue: voucherData.discountValue,
      //   appliedDiscount: discount,
      // },
      discount: parseFloat(discount.toFixed(2)),
      // finalTotal: parseFloat(finalTotal.toFixed(2)),
    });
  } catch (error) {
    console.error('Voucher API error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
