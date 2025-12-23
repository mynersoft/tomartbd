"use client";

import React, { useEffect, useState } from "react";
import {
	Search,
	Filter,
	Eye,
	CheckCircle,
	XCircle,
	Clock,
	Truck,
	Package,
} from "lucide-react";
import { useDeleteOrder } from "@/hooks/useOrder";
import { useSelector } from "react-redux";

const OrderTable = ({ data }) => {
	const user = useSelector((state) => state.user.user);

	// ✅ State
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState("desc");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const deleteOrderMutation = useDeleteOrder();







const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    const res = await fetch("/api/admin/updateOrderStatus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update status");
      return;
    }

    toast.success("Order status updated successfully");
    // Optionally refresh data here
    // router.refresh() or refetch your orders
  } catch (error) {
    toast.error("Something went wrong");
  }
};





	// Format helpers
	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	const formatCurrency = (amount) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);

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

	const handleViewOrder = (order) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};




const handleCancelOrder = async (orderId) => {
  try {
    const res = await fetch(`/api/order/cancel/${orderId}`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Order cancel failed");
      return;
    }

    toast.success("Order cancelled successfully");
    // চাইলে এখানে refetch / router.refresh() দিতে পারো
  } catch (error) {
    toast.error("Something went wrong");
  }
};



	const handleStatusUpdate = (orderId, newStatus) => {
		console.log("Update order:", orderId, "to", newStatus);
	};

	const handleDelete = (id) => {
		if (confirm("Are you sure you want to delete this order?")) {
			deleteOrderMutation.mutate(id);
		}
	};

	// -------------------------------
	// Filter + Sort Logic (Safe)
	// -------------------------------
	useEffect(() => {
		// Ensure data is always an array
		let ordersArray = Array.isArray(data) ? data : data?.orders || [];
		let result = [...ordersArray];

		// Filter by search
		if (searchTerm) {
			result = result.filter(
				(order) =>
					order._id
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					order.customer.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					order.customer.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		// Filter by status
		if (selectedStatus !== "all") {
			result = result.filter((order) => order.status === selectedStatus);
		}

		// Sort
		result.sort((a, b) => {
			let aValue, bValue;
			switch (sortBy) {
				case "date":
					aValue = new Date(a.createdAt);
					bValue = new Date(b.createdAt);
					break;
				case "total":
					aValue = a.total;
					bValue = b.total;
					break;
				case "customer":
					aValue = a.customer.name.toLowerCase();
					bValue = b.customer.name.toLowerCase();
					break;
				default:
					aValue = a._id;
					bValue = b._id;
			}
			if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
			return aValue < bValue ? 1 : -1;
		});

		setFilteredOrders(result);
		setCurrentPage(1);
	}, [searchTerm, selectedStatus, sortBy, sortOrder, data]);

	// -------------------------------
	// UI
	// -------------------------------
	return (
		<div className="bg-white rounded-lg shadow mb-6">
			{/* Top controls */}
			<div className="p-6 border-b">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search orders by ID, customer name, or email..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Filters */}
					<div className="flex gap-4">
						<div className="relative">
							<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<select
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
								value={selectedStatus}
								onChange={(e) =>
									setSelectedStatus(e.target.value)
								}>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="processing">Processing</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<select
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}>
							<option value="date">Sort by Date</option>
							<option value="total">Sort by Total</option>
							<option value="customer">Sort by Customer</option>
						</select>

						<button
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
							onClick={() =>
								setSortOrder(
									sortOrder === "asc" ? "desc" : "asc"
								)
							}>
							{sortOrder === "asc" ? "↑" : "↓"}
						</button>
					</div>
				</div>
			</div>

			{/* Orders Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Invoice
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Delete
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredOrders.length > 0 ? (
							filteredOrders.map((order, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">
											{order.invoice}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center">
											<div>
												<div className="font-medium text-gray-900">
													{order.customer.name}
												</div>
												<div className="text-sm text-gray-500">
													{order.customer.email}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(order.createdAt)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">
											{formatCurrency(order.total)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
													order.status
												)}`}>
												{getStatusIcon(order.status)}
												{order.status
													.charAt(0)
													.toUpperCase() +
													order.status.slice(1)}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
											<button
												onClick={() =>
													handleViewOrder(order)
												}
												className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
												<Eye className="w-4 h-4" /> View
											</button>


<button onclick = {() =>
													handleCancelOrder(order._id)
												}>Cancel</button>


											{user.role === "user" ? (
												""
											) : (
												<select
													className="text-sm border border-gray-300 rounded px-2 py-1"
													value={order.status}
													onChange={(e) =>
														handleStatusUpdate(
															order._id,
															e.target.value
														)
													}>
													<option value="pending">
														Pending
													</option>
													<option value="processing">
														Processing
													</option>
													<option value="shipped">
														Shipped
													</option>
													<option value="delivered">
														Delivered
													</option>
													<option value="cancelled">
														Cancelled
													</option>
												</select>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() =>
												handleDelete(order._id)
											}>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="7"
									className="px-6 py-4 text-center text-gray-500">
									No orders found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrderTable;
