"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function AdminSidebar({ open, setOpen }) {
	const pathname = usePathname();

	const menu = [
		{ name: "Dashboard", href: "/dashboard/admin" },
		{ name: "Products", href: "/dashboard/admin/products" },
		{ name: "Orders", href: "/dashboard/admin/orders" },
		{ name: "Users", href: "/dashboard/admin/users" },
		{ name: "Coupons", href: "/dashboard/admin/coupons" },
		{ name: "Reports", href: "/dashboard/admin/reports" },
		{ name: "Live Orders", href: "/dashboard/admin/live-orders" },
		{ name: "Analytics", href: "/dashboard/admin/analytics" },
	];

	return (
		<>
			


				<nav className="flex flex-col gap-2 p-4">
					{menu.map((m) => (
						<Link
							key={m.href}
							href={m.href}
							className={`px-4 py-2 rounded ${
								pathname === m.href
									? "bg-blue-600"
									: "hover:bg-gray-800"
							}`}
							onClick={() => setOpen(false)} // close sidebar on mobile
						>
							{m.name}
						</Link>
					))}
				</nav>

				<button
					onClick={() => alert("Logout")}
					className="absolute bottom-6 left-6 bg-red-600 px-6 py-2 rounded">
					Logout
				</button>
			

		
		</>
	);
}
