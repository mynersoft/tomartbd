"use client";

import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useCreateBlog } from "@/hooks/useBlog";
import toast, { Toaster } from "react-hot-toast";

type BlogStatus = "draft" | "published";

export default function BlogForm() {
  const { mutate, isPending } = useCreateBlog();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<BlogStatus>("draft");

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImage = async (file: File) => {
    const loadingToast = toast.loading("Uploading image...");
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      toast.success("Image uploaded successfully!", { id: loadingToast });
      return data.url as string;
    } catch (error) {
      toast.error("Failed to upload image", { id: loadingToast });
      throw error;
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    mutate(
      {
        title,
        content,
        coverImage,
        status,
      },
      {
        onSuccess: () => {
          toast.success(
            status === "published"
              ? "Blog published successfully!"
              : "Blog saved as draft!"
          );
          // Reset form
          setTitle("");
          setContent("");
          setCoverImage("");
          setStatus("draft");
        },
        onError: (error) => {
          toast.error("Failed to save blog post");
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h2 className="text-2xl font-bold">Create Blog Post</h2>

        {/* ---------- TITLE ---------- */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Blog Title
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* ---------- COVER IMAGE ---------- */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              try {
                const url = await uploadImage(e.target.files[0]);
                setCoverImage(url);
              } catch (error) {
                // Error toast is already shown in uploadImage
              }
            }}
          />

          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="mt-3 h-40 rounded object-cover"
            />
          )}
        </div>

        {/* ---------- CONTENT (TinyMCE) ---------- */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Blog Content
          </label>

          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_MMC_API_KEY}
            value={content}
            init={{
              height: 450,
              menubar: false,
              plugins:
                "image link lists code table media autoresize",
              toolbar:
                "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image link | code",
              images_upload_handler: async (blobInfo) => {
                const formData = new FormData();
                formData.append("image", blobInfo.blob());

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();
                return data.url;
              },
            }}
            onEditorChange={(value) => setContent(value)}
          />
        </div>

        {/* ---------- STATUS ---------- */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as BlogStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>
        </div>

        {/* ---------- SUBMIT ---------- */}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-60"
        >
          {isPending ? "Publishing..." : "Publish Blog"}
        </button>
      </div>
    </>
  );
}