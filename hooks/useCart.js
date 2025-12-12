"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch cart for a user
export function useCart(userId) {
	return useQuery({
		queryKey: ["cart", userId],
		queryFn: async () => {
			if (!userId) return [];
			const res = await axios.get(`/api/cart?userId=${userId}`);
			return res.data.cart;
		},
		enabled: !!userId, // only run if userId exists
	});
}

// Add product to cart
export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ user, productId, quantity }) => {
			const res = await axios.post("/api/cart", {
				user,
				productId,
				quantity,
			});
			return res.data.cart;
		},
		onMutate: () => {
			toast.loading("Adding to cart...", { id: "add-cart" });
		},
		onSuccess: (cart) => {
			toast.success("Added to cart!", { id: "add-cart" });
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.error || err.message, {
				id: "add-cart",
			});
		},
	});
}
