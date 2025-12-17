import React, { useState } from "react";

import {
	Search,
	Filter,
	Eye,
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
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

const OrderTable = ({ data }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState("desc");
	const [selectedStatus, setSelectedStatus] = useState("all");

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

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

	return (
		<div className="bg-white rounded-lg shadow mb-6">
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

					{/* Status Filter */}
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

						{/* Sort */}
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
								Order ID
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
								Items
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.length > 0 &&
							data.map((order) => (
								<tr key={order.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">
											{order.id}
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
										{formatDate(order.date)}
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
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{order.items} items
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
											<button
												onClick={() =>
													handleViewOrder(order)
												}
												className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
												<Eye className="w-4 h-4" />
												View
											</button>
											<select
												className="text-sm border border-gray-300 rounded px-2 py-1"
												value={order.status}
												onChange={(e) =>
													handleStatusUpdate(
														order.id,
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
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrderTable;
