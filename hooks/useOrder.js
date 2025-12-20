"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOrders, addOrder, removeOrder } from "@/store/slices/orderSlice";
import toast from "react-hot-toast";
import { removeFromCart } from "@/store/slices/cartSlice";

export function useOrders() {
	const dispatch = useDispatch();

	return useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const res = await axios.get("/api/orders");
			dispatch(setOrders(res.data));
			
			return res.data.orders;
		},
		onError: (error) => {
			toast.error(`Failed to fetch Orders: ${error.message}`);
		},
		onSuccess: () => {
			toast.success("Orders fetched successfully");
		},
	});
}

export function useAddOrder() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async (orderData) => {
			const res = await axios.post("/api/orders", orderData);
			return res.data.order;
		},

		onSuccess: (newOrder) => {
			dispatch(addOrder(newOrder)); // add to Redux
			queryClient.invalidateQueries(["orders"]);
			dispatch(removeFromCart(newOrder._id));
			toast.success("Order added successfully!", { id: "add-order" });
		},
		onError: (error) => {
			let message = "Failed to add Order";
			if (axios.isAxiosError(error)) {
				message =
					error.response?.data?.error ||
					error.response?.data?.message ||
					error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			toast.error(message, { id: "add-order" });
		},
	});
}


export const useUpdateOrderStatus = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }) =>
			axios.patch(`/api/orders/${id}`, { status }),
		onSuccess: () => qc.invalidateQueries(["orders"]),
	});
};

export const useDeleteOrder = () => {
	const qc = useQueryClient();
	const dispatch = useDispatch();
	return useMutation({
		mutationFn: async (id) => {
			const res = await axios.delete(`/api/orders/${id}`);
			return res.data;
		},
		onSuccess: (_data, id) => {
			// Invalidate react-query
			qc.invalidateQueries(["orders"]);
			// Update redux slice
			dispatch(removeOrder(id));
			toast.success("Order deleted successfully");
		},
		onError: (err) => {
			toast.error(`Failed to delete order: ${err.message}`);
		},
	});
};