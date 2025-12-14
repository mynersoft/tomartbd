"use client";

import { useDispatch, useSelector } from "react-redux";
import { placeOrderCOD } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect } from "react";

export default function CheckoutPage() {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const { loading, success } = useSelector((state) => state.order);

	const totalAmount = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	const handlePlaceOrder = () => {
		const orderData = {
			products: cart.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				price: item.price,
			})),
			totalAmount,
			paymentMethod: "COD",
		};

		dispatch(placeOrderCOD(orderData));
	};

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
						className="flex justify-between border-b py-2"
					>
						<span>
							{item.name} × {item.quantity}
						</span>
						<span>৳{item.price * item