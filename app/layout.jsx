import Providers from "../components/Providers";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
	title: "Tomart BD - Your Online Agro & Tech Hub",
	description:
		"Tomart BD offers high-quality agro products, tech solutions, and insightful blogs. Explore, shop, and learn with us!",
	openGraph: {
		title: "Tomart BD - Your Online Agro & Tech Hub",
		description:
			"Tomart BD offers high-quality agro products, tech solutions, and insightful blogs. Explore, shop, and learn with us!",
		url: BASE_URL,
		siteName: "Tomart BD",
		images: [
			{
				url: `${BASE_URL}/og-image.png`,
				width: 1200,
				height: 630,
				alt: "Tomart BD Logo",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Tomart BD - Your Online Agro & Tech Hub",
		description:
			"Tomart BD offers high-quality agro products, tech solutions, and insightful blogs. Explore, shop, and learn with us!",
		images: [`${BASE_URL}/og-image.png`],
		site: "@Tomart BD",
		creator: "@Tomart BD",
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
