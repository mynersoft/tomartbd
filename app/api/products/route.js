import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET
export async function GET() {
	await connectDB();
	const products = await Product.find().sort({ createdAt: -1 });
	return Response.json(products);
}

// POST
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // 🔹 Slug helper
    const slugify = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

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
        ? data.description.substring(0, 157) + "..."
        : data.description;

    const keywords = [
      data.name,
      data.brand,
      data.category,
      ...(data.tags || []),
    ].filter(Boolean);

    // 🔹 Product type detect
    let type = "regular";
    if (data.featured) type = "featured";
    else if (data.bestseller) type = "best-selling";
    else if (data.newArrival) type = "new";

    // 🔹 Sale calculation
    const isOnSale = Number(data.discount) > 0;
    const salePrice = isOnSale
      ? Number(data.price) - (Number(data.price) * Number(data.discount)) / 100
      : null;

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
    });

    return Response.json({ success: true, product }, { status: 201 });
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
	if (!session || session.user.role !== "admin") {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	await connectDB();
	const { id, ...data } = await req.json();
	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	return Response.json(product);
}

// DELETE (Admin only)
export async function DELETE(req) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	await connectDB();
	const { id } = await req.json();
	await Product.findByIdAndDelete(id);

	return Response.json({ message: "Deleted" });
}
