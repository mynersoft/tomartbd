import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "your email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				
				await connectDB();

				const user = await User.findOne({ email: credentials.email });
				if (!user) throw new Error("User not found");

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) throw new Error("Invalid password");


				return {
					id: user._id.toString(), 
					name: user.name,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},

		async session({ session, token }) {
			session.user.id = token.id; 
			session.user.role = token.role;
			return session;
		},
	},
	pages: {
		signIn: "/auth/login", 
	},
	secret: process.env.NEXTAUTH_SECRET, 
};
