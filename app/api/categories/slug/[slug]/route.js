import {connectDB } from "@/lib/db";
import {Category} from "@/models/Category";

export async function GET(req, { params }) {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug, isActive: true });
  if (!category) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  return new Response(JSON.stringify(category), { status: 200 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const category = await Category.findByIdAndUpdate(params.slug, body, { new: true });
  return new Response(JSON.stringify(category), { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Category.findByIdAndDelete(params.slug);
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}