import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findById(params.id);
  return NextResponse.json(blog);
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const blog = await Blog.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(blog);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Blog.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}