import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  const categories = await Category.find()
    .populate("parent")
    .sort({ createdAt: -1 });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const category = await Category.create({
    name: data.name,
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    parent: data.parent || null,
    level: data.level,
  });

  return NextResponse.json({ success: true, category });
}