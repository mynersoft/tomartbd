import {connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET(req, { params }) {
  await dbConnect();
  const category = await Category.findOne({ slug: params.slug, isActive: true });
  if (!category) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  return new Response(JSON.stringify(category), { status: 200 });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const category = await Category.findByIdAndUpdate(params.slug, body, { new: true });
  return new Response(JSON.stringify(category), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Category.findByIdAndDelete(params.slug);
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}