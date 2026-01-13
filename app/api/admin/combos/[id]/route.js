import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getIdFromReq } from '@/lib/getIdFromReq';
import Combo from '@/models/Combo';
import slugify from 'slugify';

// GET single combo
export async function GET(req) {
  try {
    const id = await getIdFromReq(req);

    await connectDB();
    const combo = await Combo.findById(id);

    if (!combo) {
      return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
    }

    return NextResponse.json(combo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update combo
export async function PUT(req) {
  try {
    const id = await getIdFromReq(req);
    await connectDB();
    const body = await req.json();

    const combo = await Combo.findById(id);
    if (!combo) {
      return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
    }

    // Calculate updated prices
    const total = body.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const discountAmount = total - body.comboPrice;
    const discountPercent = total > 0 ? (discountAmount / total) * 100 : 0;

    // Update slug if title changed
    let slug = combo.slug;
    if (body.title && body.title !== combo.title) {
      slug = slugify(body.title, { lower: true, strict: true });

      // Check if new slug exists
      const existingCombo = await Combo.findOne({
        slug,
        _id: { $ne: params.id },
      });
      if (existingCombo) {
        return NextResponse.json(
          { error: 'A combo with this title already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCombo = await Combo.findByIdAndUpdate(
      params.id,
      {
        ...body,
        slug,
        totalRegularPrice: total,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        discountPercent: parseFloat(discountPercent.toFixed(2)),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedCombo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE combo
export async function DELETE(req) {
  try {
    await connectDB();
    const id = await getIdFromReq(req);
    const combo = await Combo.findByIdAndDelete(id);

    if (!combo) {
      return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Combo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
