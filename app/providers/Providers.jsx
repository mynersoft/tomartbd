"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/store"; // <- FIXED PATH

const queryClient = new QueryClient();

export default function Providers({ children, session }) {
	return (
		<SessionProvider session={session}>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</Provider>
		</SessionProvider>
	);
}
