"use client";

import Link from "next/link";
import { HiHome, HiShoppingBag, HiUser, HiCog, HiLogout } from "react-icons/hi";

export default function UserSidebar() {
	return (
		<aside className="w-64 bg-white shadow-lg hidden md:block">
			<div className="p-4 text-xl font-bold text-pink-600">
				User Panel
			</div>

			<nav className="px-4 space-y-2">
				<SidebarLink
					href="/dashboard/user"
					icon={HiHome}
					label="Dashboard"
				/>
				<SidebarLink
					href="/dashboard/user/orders"
					icon={HiShoppingBag}
					label="My Orders"
				/>
				<SidebarLink
					href="/dashboard/user/profile"
					icon={HiUser}
					label="Profile"
				/>
				<SidebarLink
					href="/dashboard/user/settings"
					icon={HiCog}
					label="Settings"
				/>
			</nav>

			<div className="absolute bottom-4 left-4">
				<button className="flex items-center gap-2 text-red-500">
					<HiLogout /> Logout
				</button>
			</div>
		</aside>
	);
}

function SidebarLink({ href, icon: Icon, label }) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 text-gray-700">
			<Icon className="w-5 h-5 text-pink-500" />
			{label}
		</Link>
	);
}
