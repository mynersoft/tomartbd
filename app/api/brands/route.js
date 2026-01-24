import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Brand from '@/models/Brand';
import slugify from 'slugify';

// ✅ GET all brands
export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find().sort({ createdAt: -1 });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ CREATE brand
export async function POST(request) {
  try {
    await connectDB();
	  const body = await request.json();
	  
	  
	  const slug = slugify(body.name, {
      replacement: '-', 
      remove: undefined, 
      lower: true, 
      strict: true, 
      locale: 'en', 
      trim: true,
    });

	  const brand = await Brand.create({
		  ...body,
		  slug: slug

    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Brand already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
