// app/hooks/useCheckout.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export type CheckoutMethod = "stripe" | "cod";

export interface CheckoutItem {
	productId: string;
	quantity: number;
}

export interface CheckoutData {
	method: CheckoutMethod;
	cartItems: CheckoutItem[];
	shippingAddress?: string;
	couponCode?: string;
}

export function useCheckout() {
	return useMutation({
		mutationFn: async (data: CheckoutData) => {
			const res = await api.post("/api/checkout", data);
			return res.data;
		},
		onSuccess: (data) => {
			console.log("Checkout successful", data);
			// Optionally clear cart here or invalidate cart query
			// queryClient.invalidateQueries(["cart"]);
		},
		onError: (error: any) => {
			console.error(
				"Checkout failed",
				error.response?.data || error.message
			);
		},
	});
}
