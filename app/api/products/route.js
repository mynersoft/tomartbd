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




/**
 * Calculate sale price based on price and discount
 * @param {Number} price - regular or variant price
 * @param {Object} discount - { type: 'percentage'|'fixed', value: Number }
 * @returns {Number} salePrice
 */
function calculateSalePrice(price, discount) {
  if (!discount || !discount.value || Number(discount.value) <= 0) return price;

  if (discount.type === 'percentage') {
    return Math.max(0, price - (price * Number(discount.value)) / 100);
  } else if (discount.type === 'fixed') {
    return Math.max(0, price - Number(discount.value));
  }
  return price;
}

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

    let baseSlug = `${slugify(data.name)}-tomartbd`;
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

    // 🔹 Calculate main product salePrice
    const salePrice = calculateSalePrice(data.regularPrice, data.discount);

    // 🔹 Calculate salePrice for each variant
    const variants = (data.variants || []).map((v) => {
      const variantSalePrice = calculateSalePrice(v.price, data.discount);
      return {
        ...v,
        price: Number(v.price),
        stock: Number(v.stock || 0),
        salePrice: variantSalePrice,
      };
    });

    const discountData =
      data.discount?.value && Number(data.discount.value) > 0
        ? {
            type: data.discount.type,
            value: Number(data.discount.value),
          }
        : undefined;

    const product = await Product.create({
      ...data,
      slug,
      images: data.images || [],
      keywords,
      metaTitle,
      metaDescription,
      type,
      salePrice,
      variants,
      ...(discountData && { discount: discountData }),
    });

    return Response.json(
      { success: true, product, message: 'Product added successfully' },
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
