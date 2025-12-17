"use client";

import { useState } from "react";
import { useCreateBlog } from "@/hooks/useBlogs";

export default function CreateBlog() {
  const { mutate, isLoading } = useCreateBlog();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div>
      <h1>Create Blog</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Slug"
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        <textarea
          placeholder="Content"
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        <button type="submit">
          {isLoading ? "Saving..." : "Publish"}
        </button>
      </form>
    </div>
  );
}