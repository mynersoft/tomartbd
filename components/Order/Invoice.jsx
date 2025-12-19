import React from "react";

const Invoice = ({ order }) => {
	const formatCurrency = (amount) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);

	const formatDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Invoice</h1>
				<div className="text-right">
					<p className="font-semibold">Invoice #: {order.invoice}</p>
					<p>Date: {formatDate(order.createdAt)}</p>
				</div>
			</div>

			{/* Customer Info */}
			<div className="mb-6 border-b pb-4">
				<h2 className="text-lg font-semibold mb-2">Customer Details</h2>
				<p>Name: {order.customer.name}</p>
				<p>Email: {order.customer.email}</p>
				<p>Phone: {order.customer.phone}</p>
				<p>
					Shipping Address: {order.shipping.address},{" "}
					{order.shipping.city || ""}
				</p>
			</div>

			{/* Order Items */}
			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Order Items</h2>
				<table className="w-full border border-gray-300 rounded">
					<thead className="bg-gray-100">
						<tr>
							<th className="border px-4 py-2 text-left">Item</th>
							<th className="border px-4 py-2">Qty</th>
							<th className="border px-4 py-2">Price</th>
							<th className="border px-4 py-2">Total</th>
						</tr>
					</thead>
					<tbody>
						{order.orderItems.map((item) => (
							<tr key={item._id} className="hover:bg-gray-50">
								<td className="border px-4 py-2">
									{item.name}
								</td>
								<td className="border px-4 py-2 text-center">
									{item.quantity}
								</td>
								<td className="border px-4 py-2 text-right">
									{formatCurrency(item.price)}
								</td>
								<td className="border px-4 py-2 text-right">
									{formatCurrency(item.price * item.quantity)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Total Amount */}
			<div className="flex justify-end">
				<div className="w-1/3">
					<div className="flex justify-between border-b py-1">
						<span className="font-semibold">Subtotal:</span>
						<span>{formatCurrency(order.total)}</span>
					</div>
					{/* Optional taxes/shipping */}
					{/* <div className="flex justify-between py-1">
            <span className="font-semibold">Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold">Shipping:</span>
            <span>$0.00</span>
          </div> */}
					<div className="flex justify-between py-2 text-lg font-bold">
						<span>Total:</span>
						<span>{formatCurrency(order.total)}</span>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="mt-6 text-center text-gray-500">
				Thank you for your order!
			</div>
		</div>
	);
};

export default Invoice;
