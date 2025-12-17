"use client";

import { useDispatch, useSelector } from "react-redux";
import { placeOrderCOD } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import useLoginUser from "@/hooks/useAuth.js";
=======
>>>>>>> 503647f00ae3ee40dc3cd99582a31f32071fde72

export default function CheckoutPage() {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const { loading, success } = useSelector((state) => state.order);

<<<<<<< HEAD
		const { user, isAuthenticated, isAdmin } = useLoginUser();
=======
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");
>>>>>>> 503647f00ae3ee40dc3cd99582a31f32071fde72

	const totalAmount = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	console.log(user );

	const handlePlaceOrder = () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 503647f00ae3ee40dc3cd99582a31f32071fde72
	};


	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

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

<<<<<<< HEAD
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
=======
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
>>>>>>> 503647f00ae3ee40dc3cd99582a31f32071fde72
		</div>
	);
}
