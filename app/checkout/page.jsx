"use client";

import { useDispatch, useSelector } from "react-redux";
import { placeOrderCOD } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const { loading, success } = useSelector((state) => state.order);

	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");

	const totalAmount = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	const handlePlaceOrder = () => {
		dispatch(
			placeOrderCOD({
				products: cart.map((item) => ({
					productId: item.productId,
					name: item.name,
					quantity: item.quantity,
					price: item.price,
				})),
				totalAmount,
				address,
				city,
				phone,
			})
		);
	};

	useEffect(() => {
		if (success) {
			dispatch(clearCart());
		}
	}, [success, dispatch]);

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Checkout</h1>

			<input
				className="w-full border p-2 mb-3"
				placeholder="Address"
				value={address}
				onChange={(e) => setAddress(e.target.value)}
			/>
			<input
				className="w-full border p-2 mb-3"
				placeholder="City"
				value={city}
				onChange={(e) => setCity(e.target.value)}
			/>
			<input
				className="w-full border p-2 mb-4"
				placeholder="Phone"
				value={phone}
				onChange={(e) => setPhone(e.target.value)}
			/>

			<button
				onClick={handlePlaceOrder}
				disabled={loading || cart.length === 0}
				className="w-full bg-black text-white py-3 rounded"
			>
				{loading ? "Placing Order..." : "Confirm Order (COD)"}
			</button>

			{success && (
				<p className="text-green-600 mt-4 text-center">
					Order placed successfully!
				</p>
			)}
		</div>
	);
}