import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./lib/util";
import User from "@/app/model/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
      
        try {
          await connectDB();
          const user = await User.findOne({ email });
      
          if (!user) {
            console.log("No user found with this email");
            throw new CredentialsSignin("No user found with this email");
          }
      
          const isMatch = await bcrypt.compare(password, user.password);
      
          if (isMatch) {
            console.log("Password is correct");
            return user;
          } else {
            console.log("Password is incorrect");
            throw new CredentialsSignin(Error('Password is incorrect'));
          }
        } catch (error) {
          console.log("Error signing in", error);
          throw new CredentialsSignin("Please check your email and password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("user", user);
      if (account.provider === "google") {
        try {
          await connectDB();
          let existingUser = await User.findOne({ email: user.email });
          const hashsedPassword = await bcrypt.hash("password", 10);
          if (!existingUser) {
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              password:hashsedPassword
            });
          }
        } catch (error) {
          console.error("Error storing Google user:", error);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.id = dbUser?._id.toString();
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    }
  },
  
};


export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

