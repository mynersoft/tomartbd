// app/hooks/useUserOrders.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useUserOrders() {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await api.get("/orders/user");
      return res.data.orders;
    },
    staleTime: 5 * 60 * 1000,
  });
}