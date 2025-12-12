"use client";
import AdminSidebar from "@/components/Dashboard/Admin/AdminSidebar";
import useAdminAuth from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }) {
	useAdminAuth(); // enforce admin access


	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Sidebar */}
			<AdminSidebar  />

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
			

				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
