"use client";

import { useState } from "react";
import { useCreateBlog } from "@/hooks/useBlog";

export default function CreateBlog() {
  const { mutate, isLoading } = useCreateBlog();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    isFeatured: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Create Blog</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow border"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Blog Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="blog-slug-example"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Short Description
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Short summary (max 300 characters)"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Blog Content
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write full blog content here..."
            rows={8}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image URL
          </label>
          <input
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://image-url.jpg"
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Cattle, Goat"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="feed, vaccine, health"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h2 className="font-semibold mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="SEO title (max 60)"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="SEO description (max 160)"
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Status & Featured */}
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Featured Blog</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}