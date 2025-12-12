import Providers from "./providers/Providers";
import Header from "@/components/Header";
import "./globals.css";
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Header />
					{children}
				</Providers>
			</body>
		</html>
	);
}
