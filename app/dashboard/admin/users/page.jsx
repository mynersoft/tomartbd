"use client";

import { useUsers, useDeleteUser, useUpdateUserRole } from "@/hooks/useUsers";
import { useState } from "react";

export default function UserManagementPage() {
	const { data: users, isLoading, isError } = useUsers();
	const deleteUserMutation = useDeleteUser();
	const updateRoleMutation = useUpdateUserRole();
	const [deletingId, setDeletingId] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this user?"))
			return;
		setDeletingId(id);
		deleteUserMutation.mutate(id, { onSettled: () => setDeletingId(null) });
	};

	const handleRoleChange = (id, newRole) => {
		setEditingId(id);
		updateRoleMutation.mutate(
			{ id, role: newRole },
			{ onSettled: () => setEditingId(null) }
		);
	};

	if (isLoading) return <p>Loading users...</p>;
	if (isError) return <p>Failed to load users</p>;

	return (
		<div className="overflow-x-auto bg-white shadow rounded p-4">
			<h1 className="text-2xl font-bold mb-4">User Management</h1>
			<table className="w-full table-auto border-collapse">
				<thead>
					<tr className="bg-gray-100 text-left">
						<th className="p-2 border">Name</th>
						<th className="p-2 border">Email</th>
						<th className="p-2 border">Role</th>
						<th className="p-2 border">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id} className="hover:bg-gray-50">
							<td className="p-2 border">{user.name}</td>
							<td className="p-2 border">{user.email}</td>
							<td className="p-2 border">
								<select
									value={user.role}
									onChange={(e) =>
										handleRoleChange(
											user._id,
											e.target.value
										)
									}
									disabled={editingId === user._id}
									className="border px-2 py-1 rounded">
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</td>
							<td className="p-2 border flex gap-2">
								<button
									className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
									onClick={() => handleDelete(user._id)}
									disabled={
										deletingId === user._id ||
										deleteUserMutation.isLoading
									}>
									{deletingId === user._id
										? "Deleting..."
										: "Delete"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
