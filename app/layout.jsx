import Providers from "./providers/Providers";
import "./globals.css";
import Header from "../components/Header";


import BottomNavigation from " @/components/BottomMenu

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
