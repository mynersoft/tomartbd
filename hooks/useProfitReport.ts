"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useProfitReport() {
	return useQuery({
		queryKey: ["profit-report"],
		queryFn: async () => {
			const res = await api.get("/admin/profit-report");
			return res.data;
		},
	});
}
