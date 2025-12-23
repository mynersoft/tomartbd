"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomMenu";
import { useState } from "react";
import GoogleAnalytics from "./GoogleAnalytics";
import MessengerChat from "./MessengerChat";
import InitData from "./InitData";


const queryClient = new QueryClient();


export default function Providers({ children }) {
	const [activeTab, setActiveTab] = useState("Home");


	return (
		<SessionProvider>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<InitData />
					<Toaster />
					<GoogleAnalytics />
					<MessengerChat />
					<Header />

					{children}

					{/* Mobile only */}
					<div className="block mt-8 md:hidden">
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
