import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import Product from '@/models/Product';
import Bogo from '@/models/Bogo';

// GET /api/products?offer=BOGO
export async function GET(req, res) {
  try {
    await connectDB();
    const products = await Bogo.find({
      isActive: true,
      'offer.type': 'BOGO',
    });
    return NextResponse.json(
      {
        message: 'Bogo get successfully',
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/admin/products (create BOGO product)
export async function POST(req, res) {
  try {
    const {
      name,
      price,
      offerType, // 'BOGO', 'DISCOUNT', 'NONE'
      buyQty,
      getQty,
    } = req.body;

    const productData = {
      ...req.body,
      name,
      regularPrice: price,
      salePrice: price,
      // ... other fields
    };

    if (offerType === 'BOGO') {
      productData.offer = {
        type: 'BOGO',
        buyQty: buyQty || 1,
        getQty: getQty || 1,
        sameProductOnly: true,
      };
    }

    const product = await Product.create(productData);

    return NextResponse.json(
      {
        message: 'Bogo get successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
