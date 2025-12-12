"use client";
import useAdminAuth from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }) {
	useAdminAuth(); // enforce admin access

	return (
		<div className="min-h-screen bg-gray-100">
			<aside className="w-64 bg-white shadow-md p-4 fixed h-full">
				<h2 className="text-xl font-bold mb-4">Admin Menu</h2>
				<ul className="space-y-2">
					<li>
						<a
							href="/admin/dashboard"
							className="hover:text-blue-600">
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="/admin/products"
							className="hover:text-blue-600">
							Products
						</a>
					</li>
					<li>
						<a href="/admin/orders" className="hover:text-blue-600">
							Orders
						</a>
					</li>
				</ul>
			</aside>
			<main className="ml-64 p-6">{children}</main>
		</div>
	);
}

// <div className="flex min-h-screen bg-gray-100">
// 	{/* Sidebar */}
// 	<Sidebar logoutMutation={logoutMutation} />

// 	{/* Main Content */}
// 	<div className="flex-1 flex flex-col">
// 		<Topbar user={me?.user} />

// 		<div className="p-6">{children}</div>
// 	</div>
// </div>
