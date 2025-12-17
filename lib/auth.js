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
				// Connect to DB
				await connectDB();

				// Find user by email
				const user = await User.findOne({ email: credentials.email });
				if (!user) throw new Error("User not found");

				// Verify password
				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) throw new Error("Invalid password");

				// Return user object with id
				return {
					id: user._id.toString(), // important for session
					name: user.name,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		// Add user.id and role to JWT token
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},

		// Add id and role to session.user
		async session({ session, token }) {
			session.user.id = token.id; // now session.user.id is available
			session.user.role = token.role;
			return session;
		},
	},
	pages: {
		signIn: "/auth/login", // optional: your custom sign-in page
	},
	secret: process.env.NEXTAUTH_SECRET, // set in .env
};
