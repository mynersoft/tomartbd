// app/api/admin/combos/route.js
import { NextResponse } from 'next/server';
import Combo from '@/models/Combo';
import { connectDB } from '@/lib/db';
import slugify from 'slugify';

export async function GET() {
  try {
    await connectDB();
    const combos = await Combo.find().sort({ createdAt: -1 });
    return NextResponse.json({ combos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create combo
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.products || body.products.length === 0) {
      return NextResponse.json(
        { error: 'Title and products are required' },
        { status: 400 }
      );
    }

    // Calculate prices
    const total = body.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const discountAmount = total - body.comboPrice;
    const discountPercent = total > 0 ? (discountAmount / total) * 100 : 0;

    // Generate slug
    const slug = slugify(body.title, { lower: true, strict: true });

    // Check if slug exists
    const existingCombo = await Combo.findOne({ slug });
    if (existingCombo) {
      return NextResponse.json(
        { error: 'A combo with this title already exists' },
        { status: 400 }
      );
    }

    const combo = await Combo.create({
      ...body,
      slug,
      totalRegularPrice: total,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      discountPercent: parseFloat(discountPercent.toFixed(2)),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });

    return NextResponse.json(
      {
        combos: combo,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
