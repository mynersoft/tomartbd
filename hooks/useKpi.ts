"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useKpi() {
	return useQuery({
		queryKey: ["admin-kpi"],
		queryFn: async () => {
			const res = await api.get("/admin/kpi");
			return res.data;
		},
	});
}
