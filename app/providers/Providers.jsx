"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/store"; // <- FIXED PATH
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomMenu";
import { useState } from "react";

const queryClient = new QueryClient();

export default function Providers({ children, session }) {
	
	const [activeTab, setActiveTab] = useState("Home");

	return (
		<SessionProvider session={session}>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<Toaster />
					<Header />
					{children}
					<div className="mobile-only">
						<BottomNavigation
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</div>
				</QueryClientProvider>
			</Provider>
		</SessionProvider>
	);
}
