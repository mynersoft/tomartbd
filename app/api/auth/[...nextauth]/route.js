import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await connectDB();
				const user = await User.findOne({ email: credentials.email });
				if (!user) throw new Error("No user found");

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) throw new Error("Invalid password");

				return {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) token.role = user.role;
			return token;
		},
		async session({ session, token }) {
			if (token) session.user.role = token.role;
			return session;
		},
	},
	pages: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
