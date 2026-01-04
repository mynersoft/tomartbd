import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import slugify from "slugify";
import mongoose from 'mongoose';

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs);
}



export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      title,
      content,
      excerpt,
      coverImage,
      images,
      metaTitle,
      metaDescription,
      keywords,
      category,
      tags,
      status,
      isFeatured,
      author,
    } = body;

    /* ================= VALIDATION ================= */
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    /* ================= SLUG ================= */
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    /* ================= AUTO EXCERPT ================= */
    const autoExcerpt =
      excerpt ||
      content
        .replace(/<[^>]*>?/gm, '') // remove HTML tags
        .substring(0, 200);

    /* ================= READ TIME ================= */
    const words = content.split(' ').length;
    const readTime = Math.ceil(words / 200); // 200 words per minute

    /* ================= CREATE BLOG ================= */
    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      coverImage,
      images,
      metaTitle: metaTitle || title.substring(0, 60),
      metaDescription: metaDescription || autoExcerpt.substring(0, 160),
      keywords,
      category,
      tags,
      status,
      isFeatured,
      author,
      readTime,
      publishedAt: status === 'published' ? new Date() : null,
    });

    return NextResponse.json(
      {
        message: 'Blog created successfully',
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('BLOG CREATE ERROR:', error);

    return NextResponse.json(
      { message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
