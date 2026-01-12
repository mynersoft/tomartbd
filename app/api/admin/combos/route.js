// app/api/admin/combos/route.js
import { NextResponse } from 'next/server';
import Combo from '@/models/Combo';
import { connectDB } from '@/lib/db';
import slugify from 'slugify';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const total = body.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const discountAmount = total - body.comboPrice;
  const discountPercent = Math.round((discountAmount / total) * 100);

  const combo = await Combo.create({
    ...body,
    slug: slugify(body.title, { lower: true }),
    totalRegularPrice: total,
    discountAmount,
    discountPercent,
  });

  return NextResponse.json(combo);
}

export async function GET() {
  await connectDB();
  const combos = await Combo.find({ isActive: true });
  return NextResponse.json(combos);
}