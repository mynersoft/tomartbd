import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setOrders,
  addOrder,
  removeOrder,
} from "@/store/slices/orderSlice";
import toast from "react-hot-toast";

// ------------------------
// Fetch orders
// ------------------------
export function useOrders() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      dispatch(setOrders(res.data)); // store in Redux
      return res.data;
    },
    onSuccess: () => {
      toast.success("Orders fetched successfully");
    },
    onError: (error) => {
      toast.error(`Failed to fetch orders: ${error.message}`);
    },
  });
}

// ------------------------
// Add order
// ------------------------


export function useAddOrder() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        async (orderData) => {
            const res = await axios.post("/api/orders", orderData);
            return res.data.order;
        },
        {
            onMutate: () => {
                // optional: toast for loading
            },
            onSuccess: (newOrder) => {
                dispatch(addOrder(newOrder)); // update Redux
                queryClient.invalidateQueries(["orders"]);
            },
            onError: (err) => {
                console.error(err);
            },
        }
    );
}

// ------------------------
// Delete order
// ------------------------
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/orders/${id}`);
      return res.data;
    },

    onMutate: () => {
      toast.loading("Deleting order...", { id: "delete-order" });
    },

    onSuccess: (_, id) => {
      dispatch(removeOrder(id));
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order deleted successfully!", {
        id: "delete-order",
      });
    },

    onError: (error) => {
      toast.error("Failed to delete order: " + error.message, {
        id: "delete-order",
      });
    },
  });
};