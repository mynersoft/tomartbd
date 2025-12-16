"use client";

import { useDispatch, useSelector } from "react-redux";
import { placeOrderCOD } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import useLoginUser from "@/hooks/useAuth.js";

export default function CheckoutPage() {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const { loading, success } = useSelector((state) => state.order);

		const { user, isAuthenticated, isAdmin } = useLoginUser();

	const totalAmount = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	console.log(user );

	const handlePlaceOrder = () => {
		const orderData = {
			customer: {
				name: user.name,
				email: user.email,
				phone: "01868944080",
			},
			total: totalAmount,
			payment: "cod",
			shipping: {
				address: "Dhaka, Bangladesh",
				city: "Dhaka",
				country: "BD",
				cost: 60,
			},
			orderItems: [
				{
					productId: "p1",
					name: "Product One",
					quantity: 1,
					price: 500,
					image: "/img/p1.png",
				},
			],
			notes: "Please deliver fast",
		};

		dispatch(placeOrderCOD(orderData));
	};


	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (success) {
			dispatch(clearCart());
		}
	}, [success, dispatch]);

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Checkout</h1>

			<div className="bg-white shadow rounded p-4 mb-6">
				<h2 className="text-lg font-semibold mb-4">Order Summary</h2>

				{cart.map((item) => (
					<div
						key={item.productId}
						className="flex justify-between border-b py-2">
						<span>
							{item.name} × {item.quantity}
						</span>
						<span>৳{item.price * item.quantity}</span>
					</div>
				))}

				<div className="flex justify-between mt-4 font-bold">
					<span>Total</span>
					<span>৳{totalAmount}</span>
				</div>
			</div>

			<div className="bg-white shadow rounded p-4">
				<h2 className="text-lg font-semibold mb-4">Payment Method</h2>

				<div className="flex items-center gap-2 mb-4">
					<input type="radio" checked readOnly />
					<span>Cash on Delivery</span>
				</div>

				<button
					onClick={handlePlaceOrder}
					disabled={loading || cart.length === 0}
					className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
					{loading ? "Placing Order..." : "Confirm Order"}
				</button>

				{success && (
					<p className="text-green-600 mt-4 text-center">
						Order placed successfully!
					</p>
				)}
			</div>
		</div>
	);
}
