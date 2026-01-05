import { NextResponse } from 'next/server';
import Voucher from '@/models/Voucher';
import { connectDB } from '@/lib/db';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { voucher, cartItems, subtotal } = body;

    // ❌ Basic validation
    if (!voucher || !cartItems || subtotal == null) {
      return NextResponse.json(
        { message: 'Voucher code, cart items & subtotal required' },
        { status: 400 }
      );
    }

    // 🔎 Find voucher
    const voucher = await Voucher.findOne({ code: voucher });

    if (!voucher) {
      return NextResponse.json(
        { message: 'Invalid voucher code' },
        { status: 400 }
      );
    }

    // ❌ Status check
    if (voucher.status !== 'active') {
      return NextResponse.json(
        { message: 'Voucher inactive' },
        { status: 400 }
      );
    }

    // ⏰ Date check
    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      return NextResponse.json(
        { message: 'Voucher expired or not started' },
        { status: 400 }
      );
    }

    // 💰 Minimum order check
    if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
      return NextResponse.json(
        { message: `Minimum order ${voucher.minOrderAmount} tk required` },
        { status: 400 }
      );
    }

    let discount = 0;

    /* ---------------------------
       🎯 Apply discount logic
    ---------------------------- */

    // ✅ All products
    if (voucher.type === 'all-product') {
      if (voucher.discountType === 'percentage') {
        discount = (subtotal * voucher.discountValue) / 100;
      } else {
        discount = Math.min(voucher.discountValue, subtotal);
      }
    }

    // ✅ Product specific
    if (voucher.type === 'product-specific') {
      const eligibleTotal = cartItems
        .filter(item =>
          voucher.applicableProducts.includes(item.productId)
        )
        .reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

      if (eligibleTotal === 0) {
        return NextResponse.json(
          { message: 'No eligible products for this voucher' },
          { status: 400 }
        );
      }

      if (voucher.discountType === 'percentage') {
        discount = (eligibleTotal * voucher.discountValue) / 100;
      } else {
        discount = Math.min(voucher.discountValue, eligibleTotal);
      }
    }

    discount = Math.min(discount, subtotal);

    return NextResponse.json(
      {
        success: true,
        discount,
voucher
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Voucher apply failed',
      },
      { status: 500 }
    );
  }
}