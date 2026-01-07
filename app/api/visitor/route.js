import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { path } = body;

    // Get IP Address
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';

    // Prevent duplicate visitor (same IP per day)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const exists = await Visitor.findOne({
      ip,
      createdAt: { $gte: start },
    });

    if (exists) {
      return NextResponse.json({ success: true, message: 'Already tracked' });
    }

    await Visitor.create({
      ip,
      userAgent: req.headers.get('user-agent'),
      path,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor API error:', error);
    return NextResponse.json(
      { success: false, message: 'Visitor tracking failed' },
      { status: 500 }
    );
  }
}
