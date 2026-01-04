// components/ui/Card.tsx
"use client";

import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
	return (
		<div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 shadow-sm">
			{children}
		</div>
	);
}
