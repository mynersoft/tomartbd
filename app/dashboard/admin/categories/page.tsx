"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryAdminPage() {
	const {
		data: cats = [],
		isLoading,
		createCategory,
		updateCategory,
		deleteCategory,
	} = useCategories();

	const [name, setName] = useState("");
	const [parent, setParent] = useState<string | null>(null);
	const [level, setLevel] = useState(1);
	const [editId, setEditId] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = { name, parent, level };

		if (editId) {
			updateCategory.mutate({ id: editId, data: payload });
		} else {
			createCategory.mutate(payload);
		}

		setName("");
		setParent(null);
		setLevel(1);
		setEditId(null);
	};

	const handleEdit = (c: any) => {
		setEditId(c._id);
		setName(c.name);
		setParent(c.parent?._id || null);
		setLevel(c.level);
	};

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Category Management</h1>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className="bg-white p-4 rounded shadow mb-6 space-y-3">
				<input
					required
					placeholder="Category name"
					className="w-full border px-3 py-2 rounded"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<select
					className="w-full border px-3 py-2 rounded"
					value={level}
					onChange={(e) => setLevel(Number(e.target.value))}>
					<option value={1}>Level 1 (Parent)</option>
					<option value={2}>Level 2 (Child)</option>
					<option value={3}>Level 3 (Sub Child)</option>
				</select>

				{level > 1 && (
					<select
						className="w-full border px-3 py-2 rounded"
						value={parent || ""}
						onChange={(e) => setParent(e.target.value || null)}>
						<option value="">Select Parent Category</option>
						{cats
							.filter((c: any) => c.level === level - 1)
							.map((c: any) => (
								<option key={c._id} value={c._id}>
									{c.name}
								</option>
							))}
					</select>
				)}

				<button
					type="submit"
					className="bg-blue-600 text-white px-5 py-2 rounded">
					{editId ? "Update Category" : "Add Category"}
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
								<th className="p-3">Level</th>
								<th className="p-3">Parent</th>
								<th className="p-3 text-right">Action</th>
							</tr>
						</thead>
						<tbody>
							{cats.map((c: any) => (
								<tr key={c._id} className="border-t">
									<td className="p-3 font-medium">
										{c.name}
									</td>
									<td className="p-3 text-center">
										{c.level}
									</td>
									<td className="p-3 text-center">
										{c.parent?.name || "---"}
									</td>
									<td className="p-3 text-right space-x-2">
										<button
											onClick={() => handleEdit(c)}
											className="bg-yellow-500 text-white px-3 py-1 rounded">
											Edit
										</button>
										<button
											onClick={() =>
												deleteCategory.mutate(c._id)
											}
											className="bg-red-600 text-white px-3 py-1 rounded">
											Delete
										</button>
									</td>
								</tr>
							))}
							{!cats.length && (
								<tr>
									<td
										colSpan={4}
										className="p-6 text-center text-gray-500">
										No categories
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
