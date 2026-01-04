import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { getIdFromReq } from '@/lib/getIdFromReq';

export async function GET(req) {
  try {
    const userId = getIdFromReq(req);
    await connectDB();

    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // 🔹 single latest order of this user
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!order) {
      return NextResponse.json(
        { message: 'No order found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
