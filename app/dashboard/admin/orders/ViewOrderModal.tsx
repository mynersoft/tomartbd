"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/api";

type OrderItem = {
	_id: string;
	name: string;
	quantity: number;
	price: number;
};

type Order = {
	_id: string;
	invoice: string;
	customer: string;
	email: string;
	status: string;
	total: number;
	items: OrderItem[];
};

type Props = {
	order: Order;
	onClose: () => void;
	onUpdated: (updatedOrder: Order) => void;
};

export default function ViewOrderModal({ order, onClose, onUpdated }: Props) {
	const [status, setStatus] = useState<string>(order.status);
	const [loading, setLoading] = useState<boolean>(false);

	const updateStatus = async () => {
		setLoading(true);
		try {
			const res = await api.put(`/orders/${order._id}`, { status });
			toast.success("Order status updated!");
			onUpdated(res.data.order);
			onClose();
		} catch (err: any) {
			toast.error(
				err?.response?.data?.message || "Failed to update status"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
					<FaTimes />
				</button>

				<h2 className="text-xl font-bold mb-4">
					Order #{order.invoice}
				</h2>

				<div className="mb-4">
					<p>
						<strong>Customer:</strong> {order.customer}
					</p>
					<p>
						<strong>Email:</strong> {order.email}
					</p>
					<p>
						<strong>Total:</strong> ${order.total}
					</p>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">Items</h3>
					<ul className="border rounded p-2 space-y-2 max-h-48 overflow-y-auto">
						{order.items.map((item) => (
							<li
								key={item._id}
								className="flex justify-between">
								<span>
									{item.name} x {item.quantity}
								</span>
								<span>
									${item.price * item.quantity}
								</span>
							</li>
						))}
					</ul>
				</div>

				<div className="mb-4">
					<label className="block font-medium mb-2">Status</label>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="border px-3 py-2 rounded w-full">
						<option value="Pending">Pending</option>
						<option value="Paid">Paid</option>
						<option value="Canceled">Canceled</option>
					</select>
				</div>

				<button
					onClick={updateStatus}
					disabled={loading}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					{loading ? "Updating..." : "Update Status"}
				</button>
			</div>
		</div>
	);
}