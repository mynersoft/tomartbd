"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface ICartItem {
	_id: string;
	product: {
		_id: string;
		name: string;
		finalPrice: number;
	};
	quantity: number;
}

export default function CartPage() {
	const router = useRouter();
	const { data: cartItems = [], refetch } = useQuery<ICartItem[]>({
		queryKey: ["cart"],
		queryFn: async () => {
			const res = await api.get("/cart");
			return res.data.items;
		},
	});

	const [checkoutLoading, setCheckoutLoading] = useState(false);

	const total = cartItems.reduce(
		(sum, item) => sum + item.product.finalPrice * item.quantity,
		0
	);

	const checkoutMutation = useMutation({
		mutationFn: async (paymentMethod: "stripe" | "cod") => {
			const res = await api.post("/checkout", { paymentMethod });
			return res.data;
		},
		onSuccess: (res) => {
			if (res.paymentUrl) {
				// Stripe
				window.location.href = res.paymentUrl;
			} else {
				// COD
				router.push("/checkout/success");
			}
		},
		onError: (err: any) => {
			toast.error(err.message || "Checkout failed");
			setCheckoutLoading(false);
		},
	});

	const handleCheckout = (method: "stripe" | "cod") => {
		setCheckoutLoading(true);
		checkoutMutation.mutate(method);
	};

	return (
		<div className="max-w-5xl mx-auto p-4">
			<Toaster position="top-right" />
			<h1 className="text-3xl font-bold mb-6">Your Cart</h1>
			{cartItems.length === 0 && <p>Your cart is empty.</p>}

			{cartItems.map((item) => (
				<div
					key={item._id}
					className="flex justify-between items-center border-b py-3">
					<span>
						{item.product.name} x {item.quantity}
					</span>
					<span>৳ {item.product.finalPrice * item.quantity}</span>
				</div>
			))}

			<div className="mt-6 flex justify-between items-center font-bold text-lg">
				<span>Total:</span>
				<span>৳ {total}</span>
			</div>

			<div className="mt-4 flex gap-4">
				<button
					onClick={() => handleCheckout("stripe")}
					disabled={checkoutLoading}
					className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
					Pay with Stripe
				</button>
				<button
					onClick={() => handleCheckout("cod")}
					disabled={checkoutLoading}
					className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
					Cash on Delivery
				</button>
			</div>
		</div>
	);
}
