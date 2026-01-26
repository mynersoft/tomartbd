import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Wishlist from '@/models/Wishlist';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 


export async function DELETE(_req, { params }) {
  await connectDB();

	  const { user } = await getServerSession(authOptions);
	

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const productId = params.id;

  await Wishlist.updateOne(
    { user: user.id },
    { $pull: { products: productId } }
  );

  return NextResponse.json({ deleted: true });
}
