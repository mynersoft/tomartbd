import {connectDB} from "@/lib/db";
import Category from "@/models/Category";
import { slugify } from "@/utils/slugify";

export async function GET(req) {
  await dbConnect();
  const categories = await Category.find({ isActive: true });
  return new Response(JSON.stringify(categories), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { name, icon, subCategories } = body;

  const category = await Category.create({
    name,
    icon,
    slug: slugify(name),
    subCategories: subCategories?.map((s) => ({ name: s, slug: slugify(s) })),
  });

  return new Response(JSON.stringify(category), { status: 201 });
}