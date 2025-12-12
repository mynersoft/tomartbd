"use client";

import Providers from "./providers/Providers";
import "./globals.css";
import Header from "../components/Header";


import BottomNavigation from "../components/BottomMenu";

export default function RootLayout({ children }) {
const [activeTab, setActiveTab] = useState('Home')
	return (
		<html lang="en">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
			<body>
				<Providers>
				        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
