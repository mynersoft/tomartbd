"use client";

import Image from "next/image";
import Link from "next/link";
import type { IBlog } from "@/types/blog";

interface Props {
  blog: IBlog;
}

export default function BlogSinglePage({ blog }: Props) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* -------- Breadcrumb -------- */}
      <nav className="text-sm mb-4 text-gray-500">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-black">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{blog.title}</span>
      </nav>

      {/* -------- Title -------- */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {blog.title}
      </h1>

      {/* -------- Meta Info -------- */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
        <span>
          ✍️ {blog.author || "MahirProStore"}
        </span>
        <span>
          📅 {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* -------- Featured Image -------- */}
      {blog.featureImg && (
        <div className="relative w-full h-[220px] md:h-[420px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={blog.featureImg}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* -------- Blog Content -------- */}
      <div
        className="prose prose-lg max-w-none prose-img:rounded-xl prose-a:text-blue-600"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* -------- Keywords / Tags -------- */}
      {blog.keywords && blog.keywords.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.keywords.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}