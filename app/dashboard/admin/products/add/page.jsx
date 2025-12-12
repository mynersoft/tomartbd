"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddProductPage() {
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
			process.env.CLOUDINARY_UPLOAD_PRESET
		);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
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

	setForm((prev) => ({
		...prev,
		images: uploaded,
	}));
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
			} else {
				toast.error(data.error || "Failed to add product");
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
			<h1 className="text-2xl font-bold mb-4">Add New Product</h1>
			<form className="space-y-4" onSubmit={handleAddProduct}>
				<input
					type="text"
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="Product Name"
					className="w-full border px-3 py-2 rounded"
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
					className="w-full border px-3 py-2 rounded"
					required
				/>
				<input
					type="text"
					name="brand"
					value={form.brand}
					onChange={handleChange}
					placeholder="Brand"
					className="w-full border px-3 py-2 rounded"
				/>
				<select
					name="category"
					value={form.category}
					onChange={handleChange}
					className="w-full border px-3 py-2 rounded">
					<option value="electronics">Electronics</option>
					<option value="mobile">Mobile</option>
					<option value="fashion">Fashion</option>
					<option value="hardware">Hardware</option>
					<option value="other">Other</option>
				</select>
				<div className="flex gap-2">
					<input
						type="number"
						name="price"
						value={form.price}
						onChange={handleChange}
						placeholder="Price"
						className="w-1/2 border px-3 py-2 rounded"
						required
					/>
					<input
						type="number"
						name="discount"
						value={form.discount}
						onChange={handleChange}
						placeholder="Discount %"
						className="w-1/2 border px-3 py-2 rounded"
					/>
				</div>
				<input
					type="number"
					name="stock"
					value={form.stock}
					onChange={handleChange}
					placeholder="Stock Quantity"
					className="w-full border px-3 py-2 rounded"
					required
				/>
				<input
					type="text"
					name="sku"
					value={form.sku}
					onChange={handleChange}
					placeholder="SKU"
					className="w-full border px-3 py-2 rounded"
				/>
				<input
					type="text"
					name="tags"
					value={form.tags}
					onChange={handleChange}
					placeholder="Tags (comma separated)"
					className="w-full border px-3 py-2 rounded"
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
					className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
					Add Product
				</button>
			</form>
		</div>
	);
}
