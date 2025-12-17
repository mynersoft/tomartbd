import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug });
  return NextResponse.json(blog);
}