/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
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

module.exports = config;
