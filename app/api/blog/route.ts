import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { slugify, makeExcerpt, makeSEO } from "@/lib/blog-utils";

/* ================= CREATE BLOG ================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, content, status } = body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    /* ---------- SLUG ---------- */
    const slug = slugify(title);

    /* ---------- DUPLICATE SLUG CHECK ---------- */
    const exists = await Blog.findOne({ slug });
    if (exists) {
      return NextResponse.json(
        { message: "Blog with this title already exists" },
        { status: 409 }
      );
    }

    /* ---------- CREATE BLOG ---------- */
    const blog = await Blog.create({
      ...body,
      slug,
      excerpt: makeExcerpt(content),
      seo: makeSEO(title, content),
      publishedAt: status === "published" ? new Date() : null,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("BLOG CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create blog",
        error: process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
      },
      { status: 500 }
    );
  }
}

/* ================= GET BLOGS ================= */
export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .select("title slug excerpt coverImage publishedAt")
      .lean();

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("BLOG FETCH ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch blogs",
        error: process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
      },
      { status: 500 }
    );
  }
}