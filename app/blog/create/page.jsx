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
    <div>
      <h1>Create Blog</h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Slug */}
        <input
          name="slug"
          placeholder="blog-slug-example"
          value={form.slug}
          onChange={handleChange}
          required
        />

        {/* Excerpt */}
        <textarea
          name="excerpt"
          placeholder="Short description (max 300)"
          value={form.excerpt}
          onChange={handleChange}
        />

        {/* Content */}
        <textarea
          name="content"
          placeholder="Full blog content"
          value={form.content}
          onChange={handleChange}
          required
        />

        {/* Cover Image */}
        <input
          name="coverImage"
          placeholder="Cover image URL"
          value={form.coverImage}
          onChange={handleChange}
        />

        {/* Category */}
        <input
          name="category"
          placeholder="Category (eg: Cattle, Goat)"
          value={form.category}
          onChange={handleChange}
        />

        {/* Tags */}
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />

        {/* SEO Meta Title */}
        <input
          name="metaTitle"
          placeholder="SEO Meta Title (max 60)"
          value={form.metaTitle}
          onChange={handleChange}
        />

        {/* SEO Meta Description */}
        <textarea
          name="metaDescription"
          placeholder="SEO Meta Description (max 160)"
          value={form.metaDescription}
          onChange={handleChange}
        />

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        {/* Featured */}
        <label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          Featured Blog
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}