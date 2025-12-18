"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useLoginUser from "@/hooks/useAuth";
import Image from "next/image";


export default function Header() {
	const { qty } = useSelector((state) => state.cart);

	const { user } = useLoginUser();


	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<header className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
				{/* Logo */}
				<Link href="/" className="text-2xl font-bold text-blue-600">
					TomartBD
				</Link>

				{/* Navigation */}
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

				{/* Cart + User */}
				<div className="flex items-center space-x-4">
					<Link
						href="/cart"
						className="relative text-gray-700 hover:text-blue-600">
						<FaShoppingCart size={24} />
						{mounted && qty > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
								{qty}
							</span>
						)}
					</Link>

					{user ? (
						<>
							<div className="flex items-center space-x-2">
								<Link
									href={
										user.role == "admin"
											? "/dashboard/admin"
											: "/dashboard/user"
									}>
									{user.image ? (
										<Image
											alt={user.name}
											src={user.image}
											height={100}
											width={100}
											className="rounded h-8 w-8"
										/>
									) : (
										<FaUser size={20} className="mx-4" />
									)}
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
