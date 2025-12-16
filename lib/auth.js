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
        email: {},
        password: {},
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
          id: user._id.toString(), // ✅ VERY IMPORTANT
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
        token.id = user.id;   // ✅ ADD THIS
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ;   // ✅ ADD THIS
      session.user.role = token.role;
      return session;
    },
  },
};
