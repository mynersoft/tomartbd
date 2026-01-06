import { NextResponse } from 'next/server';
import { validateVoucher } from '@/lib/validateVoucher'; // your reusable function

export async function POST(req) {
  try {
    const body = await req.json();

    const { voucherCode, cartItems, subtotal } = body;

    // Call your reusable validator
    const res = await validateVoucher({ voucherCode, cartItems, subtotal });
    const checkedRes = await res.json();

    if (res.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          message: checkedRes.message,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        voucher: checkedRes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Voucher API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
