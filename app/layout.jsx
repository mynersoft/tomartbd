import Providers from "../components/Providers";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
	title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
	description:
		"Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd. Affordable prices, fast delivery, and a wide selection for every home and project.",
	keywords:
		"Tomartbd, Hardware, Home Decor, Electrical Items, Accessories, Online Shop, Affordable, Quality Products",
	author: "Tomartbd",
	openGraph: {
		title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
		description:
			"Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd. Affordable prices, fast delivery, and a wide selection for every home and project.",
		url: BASE_URL,
		siteName: "Tomartbd Shop",
		images: [
			{
				url: `${BASE_URL}/og-image.png`,
				width: 1200,
				height: 630,
				alt: "Tomartbd Shop",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
		description:
			"Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd. Affordable prices, fast delivery, and a wide selection for every home and project.",
		images: [`${BASE_URL}/og-image.png`],
		site: "@Tomartbd",
		creator: "@Tomartbd",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<meta charSet="UTF-8" />
				<meta name="robots" content="index, follow" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
