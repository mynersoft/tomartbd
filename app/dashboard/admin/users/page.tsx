"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ["adminUsers", { page, limit, search }],
    [page, limit, search]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);

      const res = await api.get(`/admin/users?${params.toString()}`);
      return res.data;
    },
    placeholderData: (prev) => prev ?? { users: [], pages: 1 },
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/admin/users", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setForm({ name: "", email: "", role: "user", password: "" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch(`/admin/users/${editingUser?._id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setEditingUser(null);
      setForm({ name: "", email: "", role: "user", password: "" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) updateUserMutation.mutate(form);
    else addUserMutation.mutate(form);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteUserMutation.mutate(id);
  };

  const users: User[] = data?.users || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-4 bg-white p-4 shadow rounded space-y-2"
      >
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            className="border px-2 py-1 rounded w-full md:w-auto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border px-2 py-1 rounded w-full md:w-auto"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-2 py-1 rounded w-full md:w-auto"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            {...(!editingUser ? { required: true } : {})}
          />
          <select
            className="border px-2 py-1 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            {editingUser ? "Update" : "Add"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-1 rounded"
              onClick={() => {
                setEditingUser(null);
                setForm({
                  name: "",
                  email: "",
                  role: "user",
                  password: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <div className="flex mb-2 gap-2">
        <input
          type="text"
          placeholder="Search users..."
          className="border px-2 py-1 rounded w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setPage(1)}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">
                  {(page - 1) * limit + idx + 1}
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-4 p-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}