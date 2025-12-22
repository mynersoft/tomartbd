


// tailwind.config.js
module.exports = {
darkMode: "class",
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
  theme: {
    extend: {
      colors: {
light: {
					bg: "#ffffff",
					card: "#f9fafb",
					text: "#111827",
					muted: "#6b7280",
					border: "#e5e7eb",
				},
        'primary': {
          DEFAULT: '#004488',
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c1ff',
          300: '#66a2ff',
          400: '#3383ff',
          500: '#004488',
          600: '#003366',
          700: '#002244',
          800: '#001122',
          900: '#000811',
        },
        'accent': {
          DEFAULT: '#C0A460',
          50: '#f9f7f0',
          100: '#f3efe1',
          200: '#e8dfc3',
          300: '#dccfa5',
          400: '#d1bf87',
          500: '#C0A460',
          600: '#a88c45',
          700: '#8c7330',
          800: '#705b1b',
          900: '#544306',
        },
      },
    },
  },
}
