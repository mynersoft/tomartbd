"use client";

import { useDispatch, useSelector } from "react-redux";
import { placeOrderCOD } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import Invoice from "@/components/Order/Invoice";
import { useAddOrder } from "@/hooks/useOrder.js";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
	const router = useRouter();
	
		

	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const { loading, success } = useSelector((state) => state.order);
	const [invoice, setInvoice] = useState(null);
	const mutation = useAddOrder();

	const [orderData, setOrderData] = useState({
		address: "",
		city: "",
		phone: "",
		totalAmount: 0,
payment:{
mathod: "COD",
},
		products: cart.map((item) => ({
			productId: item.productId,
			name: item.name,
			quantity: item.quantity,
			price: item.price,
		})),
	});

	const { address, city, phone } = orderData;
	

	const handleChange = (e) => {
		const { name, value } = e.target;
		setOrderData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const totalAmount = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	const handlePlaceOrder = () => {
		mutation.mutate(orderData, {
			onSuccess: (newOrder) => {
				  router.push(`/checkout/success?orderId=${newOrder._id}`);
			},
		});
	};



	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	useEffect(() => {
		setOrderData((prev) => ({
			...prev, // keep existing fields
			totalAmount: totalAmount, // add/update totalAmount
		}));
	}, [setOrderData, totalAmount]);

	useEffect(() => {
		if (success) {
			dispatch(clearCart());
			setOrderData({
				address: "",
				city: "",
				phone: "",
				totalAmount: 0,
			});
		}
	}, [success, dispatch, setOrderData]);

	return (
		<div className="max-w-3xl mx-auto p-6">
			{/* <Invoice /> */}
			<h1 className="text-2xl font-bold mb-6">Checkout</h1>

			{/* Address */}
			<input
				className="w-full border p-2 mb-3 rounded"
				placeholder="Address"
				value={address}
				name="address"
				onChange={handleChange}
			/>

			{/* City */}
			<input
				className="w-full border p-2 mb-3 rounded"
				placeholder="City"
				value={city}
				name="city"
				onChange={handleChange}
			/>

			{/* Phone */}
			<input
				className="w-full border p-2 mb-4 rounded"
				placeholder="Phone"
				value={phone}
				name="phone"
				onChange={handleChange}
			/>

			{/* Place Order Button */}
			<button
				onClick={handlePlaceOrder}
				className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
				{loading ? "Placing Order..." : "Confirm Order (COD)"}
			</button>

			{/* Success Message */}
			{success && (
				<p className="text-green-600 mt-4 text-center">
					Order placed successfully!
				</p>
			)}

			{/* Optional: Display cart summary */}
			<div className="mt-6 border-t pt-4">
				<h2 className="text-lg font-semibold mb-2">Order Summary</h2>
				{cart.map((item, index) => (
					<div key={index} className="flex justify-between mb-1">
						<span>
							{item.name} x {item.quantity}
						</span>
						<span>${item.price * item.quantity}</span>
					</div>
				))}
				<div className="flex justify-between font-bold mt-2">
					<span>Total</span>
					<span>${totalAmount}</span>
				</div>
			</div>
		</div>
	);
}
