import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Brand from '@/models/Brand';
import mongoose from 'mongoose';

// ✅ GET single brand
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// ✅ DELETE brand
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
