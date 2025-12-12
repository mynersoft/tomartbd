"use client";

import { useState } from "react";
import { useBrands } from "@/hooks/useBrands";

export default function BrandAdminPage() {
	const {
		data: brands = [],
		isLoading,
		createBrand,
		updateBrand,
		deleteBrand,
	} = useBrands();

	const [name, setName] = useState("");
	const [logo, setLogo] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (editingId) {
			updateBrand.mutate({
				id: editingId,
				data: { name, logo },
			});
		} else {
			createBrand.mutate({ name, logo });
		}

		setName("");
		setLogo("");
		setEditingId(null);
	};

	const handleEdit = (b: any) => {
		setEditingId(b._id);
		setName(b.name);
		setLogo(b.logo || "");
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Brand Management</h1>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className="bg-white p-4 rounded shadow mb-6 space-y-3">
				<input
					required
					placeholder="Brand name"
					className="w-full border px-3 py-2 rounded"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<input
					placeholder="Logo URL"
					className="w-full border px-3 py-2 rounded"
					value={logo}
					onChange={(e) => setLogo(e.target.value)}
				/>

				<button
					type="submit"
					className="bg-blue-600 text-white px-5 py-2 rounded">
					{editingId ? "Update Brand" : "Add Brand"}
				</button>
			</form>

			{/* Table */}
			<div className="bg-white shadow rounded overflow-x-auto">
				{isLoading ? (
					<p className="p-4">Loading...</p>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-3 text-left">Name</th>
								<th className="p-3 text-left">Logo</th>
								<th className="p-3 text-left">Slug</th>
								<th className="p-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{brands.map((b: any) => (
								<tr key={b._id} className="border-t">
									<td className="p-3 font-medium">
										{b.name}
									</td>
									<td className="p-3">
										{b.logo ? (
											<img
												src={b.logo}
												className="w-10 h-10 object-contain"
											/>
										) : (
											"No logo"
										)}
									</td>
									<td className="p-3 text-gray-500">
										{b.slug}
									</td>
									<td className="p-3 text-right space-x-2">
										<button
											onClick={() => handleEdit(b)}
											className="px-3 py-1 bg-yellow-500 text-white rounded">
											Edit
										</button>
										<button
											onClick={() =>
												deleteBrand.mutate(b._id)
											}
											className="px-3 py-1 bg-red-600 text-white rounded">
											Delete
										</button>
									</td>
								</tr>
							))}
							{brands.length === 0 && (
								<tr>
									<td
										colSpan={4}
										className="p-6 text-center text-gray-500">
										No brands found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
