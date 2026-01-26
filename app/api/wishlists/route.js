import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/wishlists
export async function GET() {
  await connectDB();

  const { user } = await getServerSession(authOptions);

  

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: 'You are not login',
      },
      { status: 200 }
    );
  }

  const wishlist = await Wishlist.findOne({ user: user.id }).populate(
    'products'
  );

  return NextResponse.json(wishlist?.products || []);
}

// POST /api/wishlists
export async function POST(req) {
  const { user } = await getServerSession(authOptions);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json(
      { message: 'Product ID required' },
      { status: 400 }
    );
  }

  let wishlist = await Wishlist.findOne({ user: user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: user.id,
      products: [productId],
    });
  } else if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return NextResponse.json({ success: true });
}
