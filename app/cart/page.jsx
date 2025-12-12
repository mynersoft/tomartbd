"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";

export default function CartPage() {
	const dispatch = useDispatch();
	const { items, qty } = useSelector((state) => state.cart);

	const handleRemove = (productId) => {
		dispatch(removeFromCart(productId));
		toast.success("Product removed from cart");
	};

	const handleQuantityChange = (productId, newQty) => {
		if (newQty < 1) return;
		dispatch(updateQuantity({ productId, quantity: newQty }));
	};

	const totalPrice = items.reduce(
		(acc, item) =>
			acc +
			(item.discount
				? ((item.price * (100 - item.discount)) / 100) * item.quantity
				: item.price * item.quantity),
		0
	);

	if (items.length === 0)
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
			</div>
		);

	return (
		<div className="max-w-6xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
			<div className="flex flex-col gap-4">
				{items.map((item) => (
					<div
						key={item._id}
						className="flex items-center gap-4 bg-white p-4 rounded shadow">
						<img
							src={item.images?.[0] || "/default-image.png"}
							alt={item.name}
							className="w-24 h-24 object-contain"
						/>
						<div className="flex-1">
							<h2 className="font-semibold text-lg">
								{item.name}
							</h2>
							<p className="text-gray-500">{item.brand}</p>
							<p className="font-bold text-blue-600">
								{item.discount
									? (
											(item.price *
												(100 - item.discount)) /
											100
									  ).toFixed(2)
									: item.price}{" "}
								৳
							</p>
						</div>

						{/* Quantity */}
						<div className="flex items-center gap-2">
							<button
								className="bg-gray-200 px-2 py-1 rounded"
								onClick={() =>
									handleQuantityChange(
										item._id,
										item.quantity - 1
									)
								}>
								-
							</button>
							<span>{item.quantity}</span>
							<button
								className="bg-gray-200 px-2 py-1 rounded"
								onClick={() =>
									handleQuantityChange(
										item._id,
										item.quantity + 1
									)
								}>
								+
							</button>
						</div>

						{/* Remove */}
						<button
							className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
							onClick={() => handleRemove(item._id)}>
							Remove
						</button>
					</div>
				))}
			</div>

			{/* Summary */}
			<div className="mt-6 p-4 bg-white rounded shadow flex justify-between items-center">
				<div>
					<p>Total Items: {qty}</p>
					<p className="font-bold text-xl">
						Total Price: {totalPrice.toFixed(2)} ৳
					</p>
				</div>
				<button
					className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
					onClick={() =>
						toast.success("Proceed to checkout coming soon!")
					}>
					Checkout
				</button>
			</div>
		</div>
	);
}
