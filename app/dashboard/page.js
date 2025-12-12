"use client";
import { useState } from "react";
import {
	useGetProductsQuery,
	useAddProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} from "@/store/slices/apiSlice";

export default function Dashboard() {


	const { data: products, isLoading } = useGetProductsQuery();
	const [addProduct] = useAddProductMutation();
	const [updateProduct] = useUpdateProductMutation();
	const [deleteProduct] = useDeleteProductMutation();

	const [form, setForm] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
		image: "",
	});

	const handleAdd = async () => {
		await addProduct({
			...form,
			price: Number(form.price),
			stock: Number(form.stock),
		});
		setForm({ name: "", description: "", price: "", stock: "", image: "" });
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

			<div className="mb-6 p-4 border rounded">
				<h2 className="font-semibold mb-2">Add Product</h2>
				<input
					type="text"
					placeholder="Name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className="border p-2 mb-2 w-full"
				/>
				<input
					type="text"
					placeholder="Description"
					value={form.description}
					onChange={(e) =>
						setForm({ ...form, description: e.target.value })
					}
					className="border p-2 mb-2 w-full"
				/>
				<input
					type="number"
					placeholder="Price"
					value={form.price}
					onChange={(e) =>
						setForm({ ...form, price: e.target.value })
					}
					className="border p-2 mb-2 w-full"
				/>
				<input
					type="number"
					placeholder="Stock"
					value={form.stock}
					onChange={(e) =>
						setForm({ ...form, stock: e.target.value })
					}
					className="border p-2 mb-2 w-full"
				/>
				<input
					type="text"
					placeholder="Image URL"
					value={form.image}
					onChange={(e) =>
						setForm({ ...form, image: e.target.value })
					}
					className="border p-2 mb-2 w-full"
				/>
				<button
					onClick={handleAdd}
					className="bg-blue-600 text-white px-4 py-2 rounded">
					Add Product
				</button>
			</div>

			<h2 className="text-2xl font-semibold mb-4">Products List</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{products?.map((p) => (
					<div key={p._id} className="border p-4 rounded shadow">
						<img
							src={p.image}
							alt={p.name}
							className="h-40 w-full object-cover mb-2"
						/>
						<h3 className="font-bold">{p.name}</h3>
						<p>{p.description}</p>
						<p className="font-semibold">Price: ${p.price}</p>
						<p>Stock: {p.stock}</p>
						<div className="flex gap-2 mt-2">
							<button
								onClick={() =>
									updateProduct({
										id: p._id,
										stock: p.stock + 1,
									})
								}
								className="bg-green-600 text-white px-2 py-1 rounded">
								+ Stock
							</button>
							<button
								onClick={() => deleteProduct(p._id)}
								className="bg-red-600 text-white px-2 py-1 rounded">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
