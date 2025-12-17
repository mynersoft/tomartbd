"use client";

import { useBlogs } from "@/hooks/useBlog";
import Link from "next/link";

export default function BlogPage() {
  const { data, isLoading } = useBlogs();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {data.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl border shadow-sm hover:shadow-md transition"
          >
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
            )}

            <div className="p-5">
              {/* Category + Featured */}
              <div className="flex items-center gap-3 mb-2">
                {blog.category && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {blog.category}
                  </span>
                )}

                {blog.isFeatured && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <Link href={`/blog/${blog.slug}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600 transition">
                  {blog.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mt-2">
                {blog.excerpt || blog.content.slice(0, 120) + "..."}
              </p>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                <span>
                  {blog.readTime
                    ? `${blog.readTime} min read`
                    : "Quick read"}
                </span>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}