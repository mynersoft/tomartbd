"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple frontend dummy save using localStorage
    const products = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    products.push({ name, price, stock, category, image });
    localStorage.setItem("sellerProducts", JSON.stringify(products));
    alert("Product added successfully!");
    router.push("/seller/products");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          className="w-full p-2 border rounded"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}