"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddProductModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "electronics",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    sku: "",
    images: [],
    tags: "",
    featured: false,
    bestseller: false,
    newArrival: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    toast.loading("Uploading images...");
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    toast.dismiss();
    toast.success("Images uploaded!");
    setForm((prev) => ({ ...prev, images: uploaded }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
          tags: form.tags.split(",").map((t) => t.trim()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product added successfully!");
        setForm({
          name: "",
          description: "",
          category: "electronics",
          brand: "",
          price: "",
          discount: "",
          stock: "",
          sku: "",
          images: [],
          tags: "",
          featured: false,
          bestseller: false,
          newArrival: true,
        });
        onClose();
      } else {
        toast.error(data.error || "Failed to add product");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold">
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>

        <form className="space-y-4" onSubmit={handleAddProduct}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUploadImages}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            required
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-1/2 border px-3 py-2 rounded focus:outline-blue-500"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded focus:outline-blue-500">
              <option value="electronics">Electronics</option>
              <option value="mobile">Mobile</option>
              <option value="fashion">Fashion</option>
              <option value="hardware">Hardware</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-1/2 border px-3 py-2 rounded focus:outline-blue-500"
              required
            />
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="Discount %"
              className="w-1/2 border px-3 py-2 rounded focus:outline-blue-500"
            />
          </div>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            required
          />

          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="w-full border px-3 py-2 rounded focus:outline-blue-500"
          />

          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border px-3 py-2 rounded focus:outline-blue-500"
          />

          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              Featured
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="bestseller"
                checked={form.bestseller}
                onChange={handleChange}
              />
              Bestseller
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="newArrival"
                checked={form.newArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}