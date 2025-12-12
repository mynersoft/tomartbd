"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAnalytics() {
	return useQuery({
		queryKey: ["admin-analytics"],
		queryFn: async () => {
			const res = await api.get("/admin/analytics");
			return res.data;
		},
	});
}
