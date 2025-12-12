"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AdminSidebar({
	logoutMutation,
}: {
	logoutMutation: any;
}) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const menu = [
		{ name: "Dashboard", href: "/admin" },
		{ name: "Products", href: "/admin/products" },
		{ name: "Orders", href: "/admin/orders" },
		{ name: "Users", href: "/admin/users" },
		{ name: "Coupons", href: "/admin/coupons" },
		{ name: "Reports", href: "/admin/reports" },
		{ name: "Live Orders", href: "/admin/live-orders" },
		{ name: "Analytics", href: "admin/analytics" },
	];

	return (
		<>
			{/* Mobile Toggle */}
			<button
				onClick={() => setOpen(!open)}
				className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3 rounded">
				{open ? <FaTimes /> : <FaBars />}
			</button>

			<div
				className={`fixed md:static z-40 h-screen w-64 bg-black text-white transform ${
					open ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 transition-all duration-300`}>
				<h2 className="text-2xl font-bold p-6 border-b border-gray-700">
					TomartBD Admin
				</h2>

				<nav className="flex flex-col gap-2 p-4">
					{menu.map((m) => (
						<Link
							key={m.href}
							href={m.href}
							className={`px-4 py-2 rounded ${
								pathname === m.href
									? "bg-blue-600"
									: "hover:bg-gray-800"
							}`}>
							{m.name}
						</Link>
					))}
				</nav>

				<button
					onClick={() => logoutMutation.mutate()}
					className="absolute bottom-6 left-6 bg-red-600 w-[85%] py-2 rounded">
					Logout
				</button>
			</div>
		</>
	);
}
