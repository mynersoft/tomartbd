import Product from '@/models/Product';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET
export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json(products);
}

// POST======================

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // 🔹 Slug helper
    const slugify = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const baseSlug = `${slugify(data.name)}-tomartbd`;
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 🔹 SEO Auto Generate
    const metaTitle = `${data.name} | Buy Online at Best Price - TomartBD`;

    const metaDescription =
      data.description?.length > 160
        ? data.description.substring(0, 157) + '...'
        : data.description;

    const keywords = [
      data.name,
      data.brand,
      data.category,
      ...(data.tags || []),
    ].filter(Boolean);

    // 🔹 Product type detect
    let type = 'regular';
    if (data.featured) type = 'featured';
    else if (data.bestseller) type = 'best-selling';
    else if (data.newArrival) type = 'new';


    console.log(data, "-==========", data.discount?.value, '===============================');
    


    // 🔹 Sale calculation - UPDATED FOR NESTED DISCOUNT
    const isOnSale = data.discount?.value && Number(data.discount.value) > 0;

    let salePrice = null;
    if (isOnSale && data.discount.type === 'percentage') {
      // Percentage discount
      salePrice =
        Number(data.price) -
        (Number(data.price) * Number(data.discount.value)) / 100;
    } else if (isOnSale && data.discount.type === 'fixed') {
      // Fixed amount discount
      salePrice = Number(data.price) - Number(data.discount.value);
    }

    // Ensure salePrice doesn't go negative
    if (salePrice !== null && salePrice < 0) {
      salePrice = 0;
    }

    // Prepare discount object for database
    const discountData =
      data.discount?.value && Number(data.discount.value) > 0
        ? {
            type: data.discount.type,
            value: Number(data.discount.value),
          }
        : undefined; // This will be omitted if no discount

    const product = await Product.create({
      ...data,
      slug,
      images: data.images || [],

      // SEO
      metaTitle,
      metaDescription,
      keywords,

      // Product logic
      type,
      isOnSale,
      salePrice,
      // Only include discount if it has a value
      ...(discountData && { discount: discountData }),
    });

    return Response.json(
      { success: true, product, message: 'Product added' },
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// PUT (Admin only)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id, ...data } = await req.json();
  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  return Response.json(product);
}

// DELETE (Admin only)
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await req.json();
  await Product.findByIdAndDelete(id);

  return Response.json({ message: 'Deleted' });
}
