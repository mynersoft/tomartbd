// components/ui/IconButton.tsx
"use client";

import { ReactNode } from "react";

type Props = {
	icon: ReactNode;
	onClick?: () => void;
	className?: string;
};

export default function IconButton({ icon, onClick, className = "" }: Props) {
	return (
		<button
			onClick={onClick}
			className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition ${className}`}>
			{icon}
		</button>
	);
}