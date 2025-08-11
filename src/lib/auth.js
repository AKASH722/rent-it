import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findByEmail } from "@/db/user";

export const authConfig = {
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await findByEmail(credentials.email);
        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token?.id;
        session.user.role = token?.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(authConfig);
