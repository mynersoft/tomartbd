import {connectDB} from "@/lib/db";
import Category from "@/models/Category";
import { slugify } from "@/utils/slugify";

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const category = await Category.findByIdAndUpdate(
    params.id,
    {
      name: body.name,
      slug: slugify(body.name),
      icon: body.icon,
      subCategories: body.subCategories?.map((s) => ({
        name: s,
        slug: slugify(s),
      })),
      isActive: body.isActive,
    },
    { new: true }
  );
  return new Response(JSON.stringify(category), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Category.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ message: "Category deleted" }), { status: 200 });
}