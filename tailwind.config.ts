// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#0b1220",
				secondary: "#2563eb",
				light: {
					bg: "#ffffff",
					card: "#f9fafb",
					text: "#111827",
					muted: "#6b7280",
					border: "#e5e7eb",
				},

				dark: {
					bg: "#020617",
					card: "#020617",
					text: "#e5e7eb",
					muted: "#9ca3af",
					border: "#1e293b",
				},
			},
		},
	},
	plugins: [],
};

export default config;
