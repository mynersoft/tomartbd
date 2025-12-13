"use client";

import React from "react";
import { HiUser, HiShoppingBag, HiTruck, HiInbox, HiX } from "react-icons/hi";

const orders = [
	{ name: "Placed", icon: HiShoppingBag },
	{ name: "To Ship", icon: HiTruck },
	{ name: "To Received", icon: HiInbox },
	{ name: "Cancelled", icon: HiX },
	{ name: "All Orders", icon: HiUser },
];

const UserProfile = ({ user }) => {
	return (
		<div className="max-w-3xl mx-auto p-4">
			{/* User Info */}
			<div className="flex items-center space-x-4 bg-gradient-to-r from-pink-100 to-pink-200 p-4 rounded-lg">
				<img
					src={user?.image || "/default-avatar.png"}
					alt={user?.name}
					className="w-16 h-16 rounded-full border-2 border-white"
				/>
				<div className="flex-1">
					<h2 className="text-lg font-semibold">{user?.name}</h2>
					<p className="text-sm text-gray-600">{user?.phone}</p>
				</div>
				<button className="p-2 bg-white rounded-full shadow-md">
					<HiUser className="w-5 h-5 text-pink-500" />
				</button>
			</div>

			{/* Orders Section */}
			<div className="mt-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-md font-semibold">My Orders</h3>
					<a
						href="/orders"
						className="text-sm text-pink-500 hover:underline">
						View All Orders
					</a>
				</div>

				{/* Orders Icons */}
				<div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
					{orders.map((order) => (
						<div
							key={order.name}
							className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition">
							<order.icon className="w-6 h-6 text-pink-500 mb-1" />
							<span className="text-xs text-center">
								{order.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
