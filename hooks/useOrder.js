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

// export function useAddOrder() {
// 	const queryClient = useQueryClient();
// 	const dispatch = useDispatch();

// 	return useMutation(
// 		async (OrderData) => {
// 			const res = await axios.post("/api/orders", OrderData);
// 			return res.data.Order;
// 		},
// 		{
// 			onMutate: () => {
// 				toast.loading("Adding Order...", { id: "add-Order" });
// 			},
// 			onSuccess: (newOrder) => {
// 				dispatch(addOrder(newOrder)); // update Redux
// 				queryClient.invalidateQueries(["orders"]); // refresh cache
// 				toast.success("Order added successfully!", {
// 					id: "add-Order",
// 				});

// 			},
// 			onError: (error) => {
// 				// Extract the real error message
// 				let message = "Failed to add Order";
// 				if (axios.isAxiosError(error)) {
// 					// Axios error: check if server returned JSON error
// 					message =
// 						error.response?.data?.error ||
// 						error.response?.data?.message ||
// 						error.message;
// 				} else if (error instanceof Error) {
// 					message = error.message;
// 				}

// 				toast.error(message, { id: "add-Order" });
// 			},
// 		}
// 	);
// }

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
      // Send id in the body
      const res = await axios.delete("/api/orders", { data: { id } });
      return res.data;
    },
    onSuccess: (_data, id) => {
      // Invalidate react-query cache
      qc.invalidateQueries(["orders"]);
      // Update redux slice
      dispatch(removeOrder(id));
      toast.success("Order deleted successfully");
    },
    onError: (err) => {
      toast.error(`Failed to delete order: ${err.response?.data?.message || err.message}`);
    },
  });
};
	