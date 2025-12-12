"use client";

import { useState } from "react";
import { useApplyCoupon, useValidateCoupon } from "@/hooks/useCoupon";

export default function CheckoutCoupon() {
	const [code, setCode] = useState("");
	const { data: couponData, error } = useValidateCoupon(code);
	const applyMutation = useApplyCoupon();

	const handleApply = () => {
		applyMutation.mutate(code, {
			onSuccess: (coupon) => {
				alert(`Coupon applied! ${coupon.discount}% off`);
			},
			onError: (err: any) => {
				alert(err?.response?.data?.error || "Invalid coupon");
			},
		});
	};

	return (
		<div className="p-4 border rounded w-full md:w-1/3">
			<h2 className="font-bold mb-2">Have a coupon?</h2>
			<div className="flex gap-2">
				<input
					type="text"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="Enter coupon code"
					className="border px-3 py-2 rounded flex-1"
				/>
				<button
					onClick={handleApply}
					className="bg-green-600 text-white px-4 py-2 rounded">
					Apply
				</button>
			</div>
			{couponData && (
				<p className="mt-2 text-green-600">
					Coupon valid: {couponData.discount}% off
				</p>
			)}
			{error && <p className="mt-2 text-red-600">{error?.message}</p>}
		</div>
	);
}
