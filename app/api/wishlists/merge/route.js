import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/wishlists/merge
export async function POST(req) {
  await connectDB();
  const { user } = await getServerSession(authOptions);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productIds } = await req.json();

  if (!Array.isArray(productIds)) {
    return NextResponse.json(
      { message: 'Invalid product list' },
      { status: 400 }
    );
  }

  let wishlist = await Wishlist.findOne({ user: user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: user.id,
      products: productIds,
    });
  } else {
    wishlist.products = [
      ...new Set([...wishlist.products.map(String), ...productIds]),
    ];
    await wishlist.save();
  }

  return NextResponse.json({ merged: true });
}
