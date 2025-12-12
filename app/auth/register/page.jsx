"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const router = useRouter();

	const handleRegister = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (res.ok) {
			alert("User created! Please login");
			router.push("/auth/login");
		} else alert(data.message);
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleRegister}
				className="p-8 border rounded shadow-md w-96">
				<h1 className="text-2xl mb-4 font-bold">Register</h1>
				<input
					type="text"
					placeholder="Name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className="w-full p-2 mb-4 border rounded"
					required
				/>
				<input
					type="email"
					placeholder="Email"
					value={form.email}
					onChange={(e) =>
						setForm({ ...form, email: e.target.value })
					}
					className="w-full p-2 mb-4 border rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={(e) =>
						setForm({ ...form, password: e.target.value })
					}
					className="w-full p-2 mb-4 border rounded"
					required
				/>
				<button
					type="submit"
					className="w-full bg-green-600 text-white p-2 rounded">
					Register
				</button>
			</form>
		</div>
	);
}
