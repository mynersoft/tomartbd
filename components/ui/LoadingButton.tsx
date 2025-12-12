// components/ui/LoadingButton.tsx
"use client";

import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	isLoading?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
};

export default function LoadingButton({
	children,
	isLoading = false,
	type = "button",
	className = "",
}: Props) {
	return (
		<button
			type={type}
			disabled={isLoading}
			className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 
			bg-blue-600 hover:bg-blue-700 text-white transition 
			${isLoading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}>
			{isLoading && (
				<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
			)}
			{children}
		</button>
	);
}