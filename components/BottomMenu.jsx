"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
	HiHome,
	HiShoppingBag,
	HiHeart,
	HiChatBubbleLeftRight,
	HiUser,
} from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";

const BottomNavigation = ({ activeTab, setActiveTab }) => {
	const pathname = usePathname();
	const { data: session } = useSession();

	const navItems = [
		{
			name: "Home",
			href: "/",
			icon: HiHome,
		},
		{
			name: "Shop",
			href: "/shop",
			icon: HiShoppingBag,
		},
		{
			name: "Wishlist",
			href: "/wishlist",
			icon: HiHeart,
		},
		{
			name: "Cart",
			href: "/cart",
			icon: FaShoppingCart,
		},
		{
			name: "Message",
			href: "/messages",
			icon: HiChatBubbleLeftRight,
		},
		{
			name: session ? "Account" : "Login",
			href: session ? "/dashboard/user" : "/auth/login",
			icon: HiUser,
		},
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-pink-500 text-white z-100 shadow-lg">
			<div className="max-w-md mx-auto">
				<div className="flex justify-around items-center py-2">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href || activeTab === item.name;

						const Icon = item.icon;

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
								<Icon className="w-6 h-6 mb-1" />
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
