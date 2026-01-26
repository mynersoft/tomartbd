import Product from '@/models/Product';
import { connectDB } from '@/lib/db';
import { generateSKU } from '@/lib/generateSKU';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import User from '@/models/User';
// GET
export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json(products);
}

// -------------------- SALE PRICE CALC --------------------
function calculateSalePrice(regularPrice, discount) {
  if (!discount || !discount.value || Number(discount.value) <= 0) {
    return regularPrice;
  }

  if (discount.type === 'percentage') {
    return Math.max(
      0,
      regularPrice - (regularPrice * Number(discount.value)) / 100
    );
  }

  if (discount.type === 'fixed') {
    return Math.max(0, regularPrice - Number(discount.value));
  }

  return regularPrice;
}

// -------------------- POST API --------------------
export async function POST(req) {
  try {
    const { user } = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorised',
        },
        { status: 404 }
      );
    }

    await connectDB();

    const data = await req.json();

    const {
      name,
      description,
      brand,
      category,
      tags,
      featured,
      bestseller,
      newArrival,
    } = data;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      );
    }

    // -------------------- SLUG --------------------
    const slugify = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let baseSlug = `${slugify(name)}-tomartbd`;
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // -------------------- SEO --------------------
    const metaTitle = `${name} | Buy Online at Best Price - TomartBD`;
    const metaDescription =
      description?.length > 160
        ? description.substring(0, 157) + '...'
        : description;

    const keywords = [name, brand, category, ...(tags || [])].filter(Boolean);

    // -------------------- PRODUCT TYPE --------------------
    let type = 'regular';
    if (featured) type = 'featured';
    else if (bestseller) type = 'best-selling';
    else if (newArrival) type = 'new';

    // -------------------- DISCOUNT --------------------
    const discountData =
      data.discount?.value && Number(data.discount.value) > 0
        ? {
            type: data.discount.type,
            value: Number(data.discount.value),
          }
        : undefined;

    // -------------------- VARIANTS --------------------
    const variants = (data.variants || []).map((v) => ({
      size: v.size,
      color: v.color,
      price: Number(v.price),
      stock: Number(v.stock || 0),
      salePrice: calculateSalePrice(Number(v.price), v.discount),
      images: v.images || [],
      ...(v.discount?.value && {
        discount: {
          type: v.discount.type,
          value: Number(v.discount.value),
        },
      }),
    }));

    // -------------------- REGULAR PRICE & SALE PRICE --------------------
    let regularPrice = 0;
    let salePrice = 0;
    let stock = Number(data.stock || 0);

    if (variants.length > 0) {
      // If variants exist → main price = 0, main stock = sum of variant stocks
      regularPrice = 0;
      salePrice = 0;
      stock = variants.reduce((total, v) => total + v.stock, 0);
    } else {
      // No variants → use main price and stock
      regularPrice = Number(data.regularPrice);
      if (!regularPrice || regularPrice <= 0) {
        return NextResponse.json(
          { success: false, message: 'Price is required' },
          { status: 400 }
        );
      }
      salePrice = calculateSalePrice(regularPrice, discountData);
    }

    // -------------------- SKU --------------------
    const sku = generateSKU(name);

    // -------------------- CREATE PRODUCT --------------------
    const product = await Product.create({
      name,
      description,
      brand,
      category,
      slug,
      sku,
      regularPrice,
      salePrice,
      vendor: user.id,
      stock,
      variants,
      images: data.images || [],
      keywords,
      metaTitle,
      metaDescription,
      type,
      ...(discountData && { discount: discountData }),
    });

    await User.findByIdAndUpdate(
      user.id,
      {
        $push: { products: product._id },
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, product, message: 'Product added successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating product:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Something went wrong',
        details: err.errors
          ? Object.values(err.errors).map((e) => e.message)
          : null,
      },
      { status: 500 }
    );
  }
}

// PUT (Admin only)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id, ...data } = await req.json();
  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  return NextResponse.json(product);
}

// DELETE (Admin only)
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await req.json();
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ message: 'Deleted' });
}
