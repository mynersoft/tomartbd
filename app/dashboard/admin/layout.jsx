"use client";

import { useState } from "react";
import AdminSidebar from "../../../components/Dashboard/AdminSidebar";

export default function AdminLayout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-auto">
				{/* Desktop Top Bar */}
				<header className="hidden md:flex h-16 items-center px-6 bg-white shadow-sm">
					<h1 className="text-xl font-bold">Admin Panel</h1>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
