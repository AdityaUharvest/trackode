import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/util";
import User from "@/app/model/User";
import bcrypt from "bcryptjs";

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
        const { email, password } = credentials;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Password is not correct");
        }
        // Return the user object with their profile data
        return {
          id: user._id.toString(), // Ensure `id` is included
          email: user.email,
          name: user.name,
          image: user.image, // Add any other fields you need
        };
        // return user object with their profile data
        return user

      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: profile?.email });
        
        if (existingUser===null) {
          const password = await bcrypt.hash("null", 10);
          const newUser = new User({
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
            provider: "google",
            password:password // Optional: Store the provider
          });

          await newUser.save();
 
          // Update the user object with the new user's ID
          user.id = newUser._id.toString();
          
        } else {
          // Update the user object with the existing user's ID
          user.id = existingUser._id.toString();
        }
      }

      return true; // Allow the sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; 
      }
      return session;
    },
  },
});