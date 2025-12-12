"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// ✅ Order type
export type Order = {
	_id: string;
	invoice: string;
	customer: string;
	email: string;
	total: number;
	status: string;
	items?: any[];
};

// ==================
// Get all orders
// ==================
export function useOrders() {
	return useQuery<Order[]>({
		queryKey: ["orders"],
		queryFn: async () => {
			const res = await api.get("/orders");
			return res.data.orders;
		},
	});
}

// ==================
// ✅ FIX: Get single order
// ==================
export function useOrder(id: string) {
	return useQuery<Order>({
		queryKey: ["order", id],
		queryFn: async () => {
			const res = await api.get(`/orders/${id}`);
			return res.data.order;
		},
		enabled: !!id,
	});
}

// ==================
// Update order
// ==================
export function useUpdateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: { status: string };
		}) => {
			const res = await api.put(`/orders/${id}`, data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

// ==================
// Delete order
// ==================
export function useDeleteOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api.delete(`/orders/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}