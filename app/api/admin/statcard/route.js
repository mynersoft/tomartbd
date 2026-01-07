import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Visitor from '@/models/Visitor';

export async function GET() {
  try {
    await connectDB();

    // 📊 Orders & Revenue
    const orderStats = await Order.aggregate([
      {
        $match: {
          'payment.status': 'paid', // ✅ correct
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }, // ✅ correct field
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // 👤 New Users (Today)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: start },
    });

    // 👀 Visitors
    const totalVisitors = await Visitor.countDocuments();

    // 🧮 Calculations
    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.totalOrders || 0;

    let conversionRate =
      totalVisitors > 0
        ? ((totalOrders / totalVisitors) * 100).toFixed()
        : '0.00';

    return NextResponse.json({
      success: true,
      statcard: {
        totalRevenue,
        totalOrders,
        newUsers,
        conversionRate,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Dashboard data error' },
      { status: 500 }
    );
  }
}
