"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart, useRemoveFromCart } from "@/hooks/useCart";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {
	const { data: session } = useSession();
	const userId = session?.user?._id;
	const [cartQty, setCartQty] = useState(0);

	// Logged-in user cart
	const { data: cartData = [], refetch } = useCart(userId);

	// Guest cart from localStorage
	const [guestCart, setGuestCart] = useState([]);

	useEffect(() => {
		if (!userId) {
			const storedCart = JSON.parse(
				localStorage.getItem("guestCart") || "[]"
			);
			setGuestCart(storedCart);
		}
	}, [userId]);

	// Listen for guest cart changes in localStorage
	useEffect(() => {
		const handleStorage = () => {
			if (!userId) {
				const storedCart = JSON.parse(
					localStorage.getItem("guestCart") || "[]"
				);
				setGuestCart(storedCart);
			}
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [userId]);

	// Total items (guest or logged-in)

	useEffect(() => {
		let total = userId
			? cartData.reduce((acc, item) => acc + item.quantity, 0)
			: guestCart.reduce((acc, item) => acc + item.quantity, 0);
		
		setCartQty(total);
	}, [cartData, guestCart, userId,cartQty]);
	const removeFromCartMutation = useRemoveFromCart();

	const handleRemove = (productId) => {
		removeFromCartMutation.mutate({
			userId,
			productId,
		});
		if (!userId) {
			// Update local guest cart instantly
			const updatedCart = guestCart.filter(
				(item) => item.product._id !== productId
			);
			setGuestCart(updatedCart);
			localStorage.setItem("guestCart", JSON.stringify(updatedCart));
		} else {
			refetch(); // logged-in user: refetch cart
		}
	};

	return (
		<header className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
				{/* Logo */}
				<Link href="/" className="text-2xl font-bold text-blue-600">
					TomartBD
				</Link>

				{/* Navigation Links */}
				<nav className="space-x-4 hidden md:flex">
					<Link
						href="/"
						className="text-gray-700 hover:text-blue-600">
						Home
					</Link>
					<Link
						href="/shop"
						className="text-gray-700 hover:text-blue-600">
						Shop
					</Link>
					<Link
						href="/dashboard"
						className="text-gray-700 hover:text-blue-600">
						Dashboard
					</Link>
				</nav>

				{/* User Info + Cart */}
				<div className="flex items-center space-x-4">
					{/* Cart Icon */}
					<Link
						href="/cart"
						className="relative text-gray-700 hover:text-blue-600">
						<FaShoppingCart size={24} />
						{cartQty > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
								{cartQty}
							</span>
						)}
					</Link>

					{/* User Login / Logout */}
					{session ? (
						<>
							<div className="flex items-center space-x-2">
								<img
									src={
										session.user.image ||
										"/default-avatar.png"
									}
									alt={session.user.name}
									className="w-8 h-8 rounded-full object-cover"
								/>
								<Link href={"/dashboard/admin"}>
									<span className="hidden sm:block text-gray-700 font-medium">
										{session.user.name}
									</span>
								</Link>
							</div>
							<button
								onClick={() => signOut({ callbackUrl: "/" })}
								className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/auth/login"
								className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
								Login
							</Link>
							<Link
								href="/auth/register"
								className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
