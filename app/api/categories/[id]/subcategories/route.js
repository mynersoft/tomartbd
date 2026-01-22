import { NextResponse } from 'next/server';
import { SubCategory } from '@/models/Category';
import {connectDB} from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const subCategories = await SubCategory.find({ 
      parentCategory: id,
      isActive: true 
    }).sort({ level: 1, name: 1 });
    
    return NextResponse.json(subCategories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    
    const subCategory = await SubCategory.create({
      ...data,
      parentCategory: id
    });
    
    return NextResponse.json(subCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}