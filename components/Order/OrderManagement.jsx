"use client";
import React, { useState, useEffect } from "react";
import {
	CheckCircle,
	XCircle,
	Clock,
	Truck,
	Package,
	DollarSign,
	Calendar,
	User,
	Phone,
	Mail,
	MapPin,
} from "lucide-react";

import { useOrders } from "@/hooks/useOrder";
import OrderTable from "@/components/Order/OrderTable";
import { useSelector } from "react-redux";
import StatsCard from "./StatsCard";

const OrderManagement = () => {
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 10;

	useOrders();
	const {
		orders: orderData,
		isLoading,
		isError,
	} = useSelector((state) => state.order);

	if (isLoading) return <p>Loading orders...</p>;
	if (isError) return <p>Failed to load order</p>;

	const handleViewOrder = (order) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	const getStatusColor = (status) => {
		const colors = {
			pending: "bg-yellow-100 text-yellow-800",
			processing: "bg-blue-100 text-blue-800",
			shipped: "bg-purple-100 text-purple-800",
			delivered: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "processing":
				return <Package className="w-4 h-4" />;
			case "shipped":
				return <Truck className="w-4 h-4" />;
			case "delivered":
				return <CheckCircle className="w-4 h-4" />;
			case "cancelled":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};


	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedOrders = filteredOrders.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Order Management
				</h1>
				<p className="text-gray-600 mt-2">
					Manage and track customer orders
				</p>
			</div>

			{/* Stats Cards */}
			<StatsCard orders={orderData} />

			<OrderTable data={orderData} />

			{/* Order Details Modal */}
			{isModalOpen && selectedOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">
									Order Details
								</h2>
								<button
									onClick={() => setIsModalOpen(false)}
									className="text-gray-400 hover:text-gray-600">
									✕
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
								{/* Order Info */}
								<div className="space-y-4">
									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="font-semibold mb-2 flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											Order Information
										</h3>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-600">
													Order ID:
												</span>
												<span className="font-medium">
													{selectedOrder.id}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">
													Date:
												</span>
												<span>
													{formatDate(
														selectedOrder.date
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">
													Status:
												</span>
												<span
													className={`px-2 py-1 rounded text-xs ${getStatusColor(
														selectedOrder.status
													)}`}>
													{selectedOrder.status}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">
													Payment Method:
												</span>
												<span>
													{selectedOrder.payment
														.replace("_", " ")
														.toUpperCase()}
												</span>
											</div>
										</div>
									</div>

									{/* Customer Info */}
									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="font-semibold mb-2 flex items-center gap-2">
											<User className="w-4 h-4" />
											Customer Information
										</h3>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<User className="w-4 h-4 text-gray-400" />
												<span>
													{
														selectedOrder.customer
															.name
													}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-gray-400" />
												<span>
													{
														selectedOrder.customer
															.phone
													}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Mail className="w-4 h-4 text-gray-400" />
												<span>
													{
														selectedOrder.customer
															.email
													}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Shipping & Total */}
								<div className="space-y-4">
									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="font-semibold mb-2 flex items-center gap-2">
											<MapPin className="w-4 h-4" />
											Shipping Information
										</h3>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-600">
													Address:
												</span>
												<span className="text-right">
													{
														selectedOrder.shipping
															.address
													}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">
													Method:
												</span>
												<span>
													{
														selectedOrder.shipping
															.method
													}
												</span>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="font-semibold mb-2 flex items-center gap-2">
											<DollarSign className="w-4 h-4" />
											Order Summary
										</h3>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-600">
													Subtotal:
												</span>
												<span>
													{formatCurrency(
														selectedOrder.total
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">
													Shipping:
												</span>
												<span>
													{formatCurrency(
														selectedOrder.shipping
															.method ===
															"express"
															? 19.99
															: 9.99
													)}
												</span>
											</div>
											<div className="flex justify-between border-t pt-2">
												<span className="font-semibold">
													Total:
												</span>
												<span className="font-bold text-lg">
													{formatCurrency(
														selectedOrder.total +
															(selectedOrder
																.shipping
																.method ===
															"express"
																? 19.99
																: 9.99)
													)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Order Items */}
							<div className="bg-gray-50 rounded-lg p-4 mb-6">
								<h3 className="font-semibold mb-4">
									Order Items ({selectedOrder.items})
								</h3>
								<div className="space-y-3">
									{[1, 2, 3]
										.slice(0, selectedOrder.items)
										.map((item, index) => (
											<div
												key={index}
												className="flex justify-between items-center p-3 bg-white rounded">
												<div className="flex items-center gap-4">
													<div className="w-16 h-16 bg-gray-200 rounded"></div>
													<div>
														<div className="font-medium">
															Product {index + 1}
														</div>
														<div className="text-sm text-gray-500">
															Quantity:{" "}
															{index + 1}
														</div>
													</div>
												</div>
												<div className="font-medium">
													{formatCurrency(
														(index + 1) * 49.99
													)}
												</div>
											</div>
										))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end gap-4">
								<button
									onClick={() => setIsModalOpen(false)}
									className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
									Close
								</button>
								<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
									Print Invoice
								</button>
								<button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
									Update Status
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderManagement;
