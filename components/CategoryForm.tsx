"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Category {
	_id: string;
	name: string;
	parent?: string;
	children?: Category[];
}

export default function CategoryAdminPage() {
	const queryClient = useQueryClient();

	// Fetch categories
	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await axios.get("/api/categories");
			return res.data.categories as Category[];
		},
	});

	// Mutations
	const addMutation = useMutation({
		mutationFn: (payload: any) => axios.post("/api/categories", payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["categories"] }),
	});

	const updateMutation = useMutation({
		mutationFn: (payload: any) => axios.put("/api/categories", payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["categories"] }),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) =>
			axios.delete("/api/categories", { data: { id } }),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["categories"] }),
	});

	// State
	const [name, setName] = useState("");
	const [parent, setParent] = useState<string | null>(null);
	const [editCategory, setEditCategory] = useState<Category | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const topCategories = data?.filter((cat) => !cat.parent) || [];

	// Handlers
	const handleAdd = () => {
		if (!name) return toast.error("Name required");
		addMutation.mutate({ name, parent });
		setName("");
		setParent(null);
	};

	const handleEditClick = (cat: Category) => {
		setEditCategory(cat);
		setName(cat.name);
		setParent(cat.parent || null);
		setIsModalOpen(true);
	};

	const handleUpdate = () => {
		if (!editCategory) return;
		updateMutation.mutate({ id: editCategory._id, name, parent });
		setIsModalOpen(false);
		setEditCategory(null);
		setName("");
		setParent(null);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure to delete this category?")) return;
		deleteMutation.mutate(id);
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold mb-6">Category Management</h1>

			{/* Add Category */}
			<div className="mb-6 bg-white p-4 rounded shadow flex gap-3 flex-wrap">
				<input
					type="text"
					className="border p-2 rounded flex-1"
					placeholder="Category Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<select
					className="border p-2 rounded"
					value={parent || ""}
					onChange={(e) => setParent(e.target.value || null)}>
					<option value="">Top-level</option>
					{topCategories.map((cat) => (
						<option key={cat._id} value={cat._id}>
							{cat.name}
						</option>
					))}
				</select>

				<button
					onClick={handleAdd}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					Add Category
				</button>
			</div>

			{/* Category Table */}
			<div className="bg-white rounded shadow overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead className="bg-gray-200">
						<tr>
							<th className="p-3 border-b">Name</th>
							<th className="p-3 border-b">Parent</th>
							<th className="p-3 border-b">Level</th>
							<th className="p-3 border-b">Actions</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={4} className="p-3 text-center">
									Loading...
								</td>
							</tr>
						) : (
							topCategories.map((cat) => (
								<CategoryRow
									key={cat._id}
									category={cat}
									handleDelete={handleDelete}
									handleEdit={handleEditClick}
									level={1}
								/>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg space-y-4">
						<h2 className="text-xl font-semibold">Edit Category</h2>

						<input
							type="text"
							className="border p-2 rounded w-full"
							placeholder="Category Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<select
							className="border p-2 rounded w-full"
							value={parent || ""}
							onChange={(e) => setParent(e.target.value || null)}>
							<option value="">Top-level</option>
							{topCategories
								.filter((c) => c._id !== editCategory?._id)
								.map((cat) => (
									<option key={cat._id} value={cat._id}>
										{cat.name}
									</option>
								))}
						</select>

						<div className="flex justify-end gap-2 mt-4">
							<button
								className="px-4 py-2 border rounded"
								onClick={() => setIsModalOpen(false)}>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
								onClick={handleUpdate}>
								Update
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Recursive row component
function CategoryRow({
	category,
	handleDelete,
	handleEdit,
	level,
}: {
	category: Category;
	handleDelete: (id: string) => void;
	handleEdit: (cat: Category) => void;
	level: number;
}) {
	return (
		<>
			<tr className="hover:bg-gray-50">
				<td className="p-3 border-b">{category.name}</td>
				<td className="p-3 border-b">
					{category.parent ? category.parent : "—"}
				</td>
				<td className="p-3 border-b">{level}</td>
				<td className="p-3 border-b flex gap-2">
					<button
						className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
						onClick={() => handleEdit(category)}>
						Edit
					</button>
					<button
						onClick={() => handleDelete(category._id)}
						className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
						Delete
					</button>
				</td>
			</tr>

			{/* Children recursively */}
			{category.children?.map((sub) => (
				<CategoryRow
					key={sub._id}
					category={sub}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
					level={level + 1}
				/>
			))}
		</>
	);
}
