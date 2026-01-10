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

    // 🔹 SEO
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

    // 🔹 Product type
    let type = 'regular';
    if (data.featured) type = 'featured';
    else if (data.bestseller) type = 'best-selling';
    else if (data.newArrival) type = 'new';

    // 🔹 Product-level discount
    const productDiscount =
      data.discount?.value && Number(data.discount.value) > 0
        ? {
            type: data.discount.type,
            value: Number(data.discount.value),
          }
        : null;

    const isOnSale = Boolean(productDiscount);

    // 🔹 Product sale price (no variant selected)
    const salePrice = calculateSalePrice({
      basePrice: Number(data.regularPrice),
      discount: productDiscount,
    });

    // 🔹 Variants price calculation (WITH variant discount priority)
    const variants =
      data.variants?.map((variant) => {
        const variantBasePrice = Number(variant.price);

        // Variant discount has priority
        const appliedDiscount =
          variant.discount?.value && Number(variant.discount.value) > 0
            ? {
                type: variant.discount.type,
                value: Number(variant.discount.value),
              }
            : productDiscount;

        const finalVariantPrice = calculateSalePrice({
          basePrice: variantBasePrice,
          discount: appliedDiscount,
        });

        return {
          size: variant.size,
          color: variant.color,
          stock: variant.stock ?? 0,

          // original price
          price: variantBasePrice,

          // applied discount
          discount: appliedDiscount,

          // final price
          salePrice: finalVariantPrice,
        };
      }) || [];

    // 🔹 Create product
    const product = await Product.create({
      name: data.name,
      slug,

      regularPrice: Number(data.regularPrice),
      salePrice,

      discount: productDiscount,
      isOnSale,

      brand: data.brand,
      category: data.category,
      description: data.description,

      images: data.images || [],
      variants,

      type,

      metaTitle,
      metaDescription,
      keywords,

      isActive: true,
    });

    return Response.json(
      { success: true, product, message: 'Product added successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
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
