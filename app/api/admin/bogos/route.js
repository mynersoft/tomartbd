import { connectDB } from '@/lib/db';
import Bogo from '@/models/Bogo';

export async function GET() {
  try {
    await connectDB();

    const bogos = await Bogo.find({})
      .populate({
        path: 'mainItem',
        select:
          '-createdAt -description -discount -freeDelivery -images -isActive -keywords -metaTitle -questions -rating -reviews -sku -type -variants -updatedAt -stock -sold -regularPrice -salePrice',
      })
      .populate({
        path: 'freeItem',
        select:
          '-createdAt -description -discount -freeDelivery -images -isActive -keywords -metaTitle -questions -rating -reviews -sku -type -variants -updatedAt -stock -sold -regularPrice -salePrice',
      })
      .sort({ createdAt: -1 });

    return Response.json(
      {
        bogos,
        message: 'Fetched successfully',
      },
      { status: 200 }
    ); // Always return array
  } catch (error) {
    console.error('Error fetching bogos:', error);
    return Response.json([], { status: 500 }); // Return empty array on error
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    const bogo = await Bogo.create(data);

    return Response.json({ bogo }, { status: 201 });
  } catch (error) {
    console.error('Error creating bogo:', error);
    return Response.json(
      { error: error.message || 'Failed to create bogo' },
      { status: 500 }
    );
  }
}
