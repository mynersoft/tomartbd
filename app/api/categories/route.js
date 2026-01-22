import { NextResponse } from 'next/server';
import { Category, SubCategory } from '@/models/Category';
import {connectDB} from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true });
    const categoriesWithSubs = await Promise.all(
      categories.map(async (cat) => {
        const subCategories = await SubCategory.find({ 
          parentCategory: cat._id,
          isActive: true 
        }).sort({ level: 1 });
        
        return {
          ...cat.toObject(),
          subCategories
        };
      })
    );
    
    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}