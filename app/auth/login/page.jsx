"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { data: session } = useSession();

	// Redirect after session loads
	useEffect(() => {
		if (session?.user?.role === "admin") {
			router.push("/dashboard/admin");
		} else if (session?.user) {
			router.push("/");
		}
	}, [session, router]);

	const handleLogin = async (e) => {
		e.preventDefault();
		const res = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		if (res?.ok) router.push("/dashboard");
		else alert(res?.error);
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleLogin}
				className="p-8 border rounded shadow-md w-96">
				<h1 className="text-2xl mb-4 font-bold">Login</h1>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-2 mb-4 border rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-2 mb-4 border rounded"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded">
					Login
				</button>
			</form>
		</div>
	);
}
