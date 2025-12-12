// app/hooks/useCoupon.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useValidateCoupon(code: string) {
	return useQuery({
		queryKey: ["coupon", code],
		queryFn: async () => {
			const res = await api.get(`/coupon?code=${code}`);
			return res.data.coupon;
		},
		enabled: !!code,
		retry: 0,
	});
}

export function useApplyCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (code: string) => {
			const res = await api.post("/coupon", { code });
			return res.data.coupon;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey:["cart"]});
		},
	});
}