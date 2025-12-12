// components/ui/Button.tsx
"use client";

import { ReactNode } from "react";

type ButtonProps = {
	children: ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary" | "danger" | "outline";
	disabled?: boolean;
	className?: string;
};

export default function Button({
	children,
	onClick,
	type = "button",
	variant = "primary",
	disabled = false,
	className = "",
}: ButtonProps) {
	const baseStyle =
		"px-4 py-2 rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variants = {
		primary:
			"bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
		secondary:
			"bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
		danger:
			"bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
		outline:
			"border border-gray-400 text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-500 dark:hover:bg-gray-800 focus:ring-gray-500",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyle} ${variants[variant]} ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			} ${className}`}>
			{children}
		</button>
	);
}