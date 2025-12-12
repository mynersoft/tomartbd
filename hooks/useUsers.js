"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// Fetch all users
export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
            const res = await axios.get("/api/users");
			return res.data; // assuming API returns { users: [...] }
		},
		onError: (err) => toast.error("Failed to fetch users: " + err.message),
	});
}

// Delete a user
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axios.delete(`/api/users/${id}`);
			return res.data;
		},
		onMutate: () =>
			toast.loading("Deleting user...", { id: "delete-user" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User deleted successfully!", { id: "delete-user" });
		},
		onError: (err) =>
			toast.error("Failed to delete user: " + err.message, {
				id: "delete-user",
			}),
	});
}
