"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useProducts } from "@/hooks/useProducts.js"

export default function ProductTable() {
	const { data: products, isLoading, isError } = useProducts();
	const [deleting, setDeleting] = useState(false);


	const handleDelete = async (id) => {
		const confirm = window.confirm(
			"Are you sure you want to delete this product?"
		);
		if (!confirm) return;

		try {
			setDeleting(true);
			await axios.delete(`/api/products/${id}`);
			toast.success("Product deleted successfully!");
		} catch (err) {
			toast.error("Failed to delete product: " + err.message);
		} finally {
			setDeleting(false);
		}
	};

	if (isLoading) return <p>Loading products...</p>;
	if (isError) return <p>Failed to load products</p>;

	return (
		<div className="overflow-x-auto bg-white shadow rounded p-4">
			<table className="w-full table-auto border-collapse">
				<thead>
					<tr className="bg-gray-100 text-left">
						<th className="p-2 border">Name</th>
						<th className="p-2 border">Category</th>
						<th className="p-2 border">Price</th>
						<th className="p-2 border">Stock</th>
						<th className="p-2 border">Featured</th>
						<th className="p-2 border">Bestseller</th>
						<th className="p-2 border">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products.map((p) => (
						<tr key={p._id} className="hover:bg-gray-50">
							<td className="p-2 border">{p.name}</td>
							<td className="p-2 border">{p.category}</td>
							<td className="p-2 border">
								{p.finalPrice || p.price}৳
							</td>
							<td className="p-2 border">{p.stock}</td>
							<td className="p-2 border">
								{p.featured ? "Yes" : "No"}
							</td>
							<td className="p-2 border">
								{p.bestseller ? "Yes" : "No"}
							</td>
							<td className="p-2 border flex gap-2">
								<button
									className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
									onClick={() =>
										toast("Edit feature coming soon!")
									}>
									Edit
								</button>
								<button
									className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
									onClick={() => handleDelete(p._id)}
									disabled={deleting}>
									{deleting ? "Deleting..." : "Delete"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
