"use client";

import Providers from "./providers/Providers";
import "./globals.css";
import Header from "../components/Header";


import BottomNavigation from "../components/BottomMenu";

export default function RootLayout({ children }) {
const [activeTab, setActiveTab] = useState('Home')
	return (
		<html lang="en">
			<body>
				<Providers>
				        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
