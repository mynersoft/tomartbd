"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



const BottomNavigation = ({
	activeTab,
	setActiveTab,
}) => {
	const pathname = usePathname();

	const navItems = [
		{
			name: "Home",
			href: "/",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10"
					/>
				</svg>
			),
		},
		{
			name: "Shop",
			href: "/shop",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			),
		},
		{
			name: "Wishlist",
			href: "/wishlist",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 21l-7-7a4.5 4.5 0 016.36-6.36L12 8.64l.64-.64A4.5 4.5 0 0119 14l-7 7z"
					/>
				</svg>
			),
		},
		{
			name: "Message",
			href: "/messages",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
			),
		},
		{
			name: "Account",
			href: "/login",
			icon: (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 7a4 4 0 100-8 4 4 0 000 8z"
					/>
				</svg>
			),
		},
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-pink-500 text-white shadow-lg">
			<div className="max-w-md mx-auto">
				<div className="flex justify-around items-center py-2">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href || activeTab === item.name;

						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setActiveTab(item.name)}
								className={`flex flex-col items-center justify-center p-2 flex-1 transition-colors duration-200 ${
									isActive
										? "text-white"
										: "text-pink-200 hover:text-white"
								}`}>
								<div className="mb-1">{item.icon}</div>
								<span className="text-xs font-medium">
									{item.name}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default BottomNavigation;
