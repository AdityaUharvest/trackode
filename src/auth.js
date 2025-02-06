import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/util"
import User from "@/app/model/User"
import bcrypt from "bcryptjs"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {

        await connectDB();
        const password = credentials.password;
        const email = credentials.email;


        // logic to verify if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordMatch = bcrypt.compare(user.password, password)
        if (!isPasswordMatch) {
          throw new Error("Password is not correct");

        }
        // return user object with their profile data
        return user
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Custom sign-in page
    error: "/signin", // Redirect to sign-in page on errors
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // Add user ID to the session
      }
      return session;
    },
  },
})