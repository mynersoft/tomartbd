"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	removeFromCart,
	updateQuantity,
	clearCart,
} from "@/store/slices/cartSlice";
import { useAddOrder } from "@/hooks/useOrder";
import {useLoginUser} from "@/hooks/useAuth";


export default function CheckoutPage() {
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.items);
	

const{user} = useLoginUser();


	const { mutate: addOrder, isPending } = useAddOrder();

	const [billingInfo, setBillingInfo] = useState({
		name: "",
		email: "",
		address: "",
		phone: "",
		city: "",
		postalCode: "",
	});

	const handleChange = (e) => {
		setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
	};

	const handleRemove = (productId) => {
		dispatch(removeFromCart(productId));
		toast.success("Product removed from cart!");
	};

	const handleQuantityChange = (productId, quantity) => {
		if (quantity < 1) return;
		dispatch(updateQuantity({ productId, quantity }));
	};

	const totalAmount = cartItems.reduce(
		(acc, item) =>
			acc +
			item.price *
				(item.discount ? (100 - item.discount) / 100 : 1) *
				item.quantity,
		0
	);

	// ------------------------
	// Handle place order
	// ------------------------
	const handlePlaceOrder = () => {
		if (!user?._id) {
			return toast.error("Please login to place order");
		}

		if (!billingInfo.name || !billingInfo.address || !billingInfo.phone) {
			return toast.error("Please fill in all required fields");
		}

		if (cartItems.length === 0) {
			return toast.error("Your cart is empty");
		}

		// Map cart to OrderSchema format
		const products = cartItems.map((item) => ({
			productId: item._id,
			quantity: item.quantity,
			price:
				item.price *
				(item.discount ? (100 - item.discount) / 100 : 1),
		}));

		// Frontend total (backend must re-calc)
		const orderPayload = {
			user: user._id,
			products,
			totalAmount,
			status: "pending",
		};

		addOrder(orderPayload, {
			onSuccess: () => {
				dispatch(clearCart());
				toast.success("Order placed successfully!");
			},
		});
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
			{/* Billing Info */}
			<div className="flex-1 bg-white shadow rounded p-6">
				<h2 className="text-2xl font-semibold mb-4">
					Billing Information
				</h2>
				<form className="space-y-4">
					<input
						type="text"
						name="name"
						value={billingInfo.name}
						onChange={handleChange}
						placeholder="Full Name"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						type="email"
						name="email"
						value={billingInfo.email}
						onChange={handleChange}
						placeholder="Email"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						type="text"
						name="phone"
						value={billingInfo.phone}
						onChange={handleChange}
						placeholder="Phone Number"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						type="text"
						name="address"
						value={billingInfo.address}
						onChange={handleChange}
						placeholder="Address"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						type="text"
						name="city"
						value={billingInfo.city}
						onChange={handleChange}
						placeholder="City"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						type="text"
						name="postalCode"
						value={billingInfo.postalCode}
						onChange={handleChange}
						placeholder="Postal Code"
						className="w-full border px-3 py-2 rounded"
					/>
				</form>
			</div>

			{/* Order Summary */}
			<div className="w-full md:w-1/3 bg-white shadow rounded p-6 flex flex-col">
				<h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

				{cartItems.length === 0 ? (
					<p className="text-gray-500">Your cart is empty</p>
				) : (
					<div className="flex-1 space-y-4">
						{cartItems.map((item) => (
							<div
								key={item._id}
								className="flex items-center justify-between gap-2">
								<div className="flex-1">
									<h3 className="font-medium">{item.name}</h3>
									<p className="text-gray-500 text-sm">
										{item.price}৳ each
									</p>
									{item.discount && (
										<p className="text-red-500 text-sm">
											Discount: {item.discount}%
										</p>
									)}
								</div>

								<div className="flex items-center gap-2">
									<input
										type="number"
										value={item.quantity}
										min={1}
										onChange={(e) =>
											handleQuantityChange(
												item._id,
												parseInt(e.target.value)
											)
										}
										className="w-16 border text-center rounded"
									/>
									<button
										onClick={() => handleRemove(item._id)}
										className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition">
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<div className="mt-4 border-t pt-4 flex justify-between font-bold text-lg">
					<span>Total:</span>
					<span>{totalAmount.toFixed(2)} ৳</span>
				</div>

				<button
					onClick={handlePlaceOrder}
					disabled={isPending}
					className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50">
					{isPending ? "Placing Order..." : "Place Order"}
				</button>
			</div>
		</div>
	);
}