import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOrders, addOrder } from "@/store/slices/orderSlice";
import toast from "react-hot-toast";

export function useOrders() {
	const dispatch = useDispatch();

	return useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const res = await axios.get("/api/orders");
			dispatch(setOrders(res.data)); // Save to Redux for global access
			return res.data; // React Query cache
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

	return useMutation(
		async (OrderData) => {
			const res = await axios.post("/api/orders", OrderData);
			return res.data.Order;
		},
		{
			onMutate: () => {
				toast.loading("Adding Order...", { id: "add-Order" });
			},
			onSuccess: (newOrder) => {
				dispatch(addOrder(newOrder)); // update Redux
				queryClient.invalidateQueries(["orders"]); // refresh cache
				toast.success("Order added successfully!", {
					id: "add-Order",
				});
			},
			onError: (error) => {
				// Extract the real error message
				let message = "Failed to add Order";
				if (axios.isAxiosError(error)) {
					// Axios error: check if server returned JSON error
					message =
						error.response?.data?.error ||
						error.response?.data?.message ||
						error.message;
				} else if (error instanceof Error) {
					message = error.message;
				}

				toast.error(message, { id: "add-Order" });
			},
		}
	);
}

export const useUpdateOrderStatus = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }) =>
			axios.patch(`/api/orders/${id}`, { status }),
		onSuccess: () => qc.invalidateQueries(["orders"]),
	});
};
