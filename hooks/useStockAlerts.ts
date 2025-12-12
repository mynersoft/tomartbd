// app/hooks/useStockAlerts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useStockAlerts() {
	return useQuery({
		queryKey: ["stockAlerts"],
		queryFn: async () => {
			// Fetch all products with low stock
			const res = await api.get("/admin/stock-alerts");
			return res.data.products;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
