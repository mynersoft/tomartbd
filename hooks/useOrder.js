import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      return data;
    },
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      axios.patch(`/api/orders/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries(["orders"]),
  });
};