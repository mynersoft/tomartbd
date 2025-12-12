"use client";

import { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";
import {
	useProducts,
	useAddProduct,
	useUpdateProduct,
	useDeleteProduct,
} from "@/hooks/useProducts";

export default function ProductManager() {
	const { data: products = [], isLoading } = useProducts();
	const addMutation = useAddProduct();
	const updateMutation = useUpdateProduct();
	const deleteMutation = useDeleteProduct();

	const [file, setFile] = useState<File | null>(null);
	const [form, setForm] = useState<any>({});

	const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		setFile(e.target.files[0]);
	};

	const handleAdd = async () => {
		if (!form.name || !form.sellPrice) {
			toast.error("Name & Sell Price required");
			return;
		}
		const fd = new FormData();
		Object.keys(form).forEach((k) => fd.append(k, form[k]));
		if (file) fd.append("image", file);
		addMutation.mutate(fd);
	};

	const handleDelete = (id: string) => deleteMutation.mutate(id);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Products</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{products.map((p: any) => (
					<div key={p._id} className="border p-3 rounded">
						<img
							src={p.image}
							className="w-full h-32 object-cover mb-2"
						/>
						<h2 className="font-semibold">{p.name}</h2>
						<p>Price: {p.sellPrice}</p>
						<button
							onClick={() => handleDelete(p._id)}
							className="text-red-600">
							Delete
						</button>
					</div>
				))}
			</div>

			{/* Add Product Form */}
			<div className="mt-6">
				<input
					placeholder="Name"
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className="border p-2"
				/>
				<input
					placeholder="Sell Price"
					type="number"
					onChange={(e) =>
						setForm({ ...form, sellPrice: e.target.value })
					}
					className="border p-2"
				/>
				<input type="file" onChange={handleFile} />
				<button
					onClick={handleAdd}
					className="bg-green-600 text-white px-3 py-1">
					Add Product
				</button>
			</div>
		</div>
	);
}
