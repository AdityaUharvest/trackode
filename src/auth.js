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
  // we have our own custom sign page and if any error occrueing then we are just redirecting to the signin page

  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  
  // we can change the session to jwt or db 
  // if we dont override the session then it will take the db as default 
  // but using jwt will be good practice - we will look into this after quiz-setup 

  callbacks: {
    async signIn({ user, account }) {
      console.log("user", user);
      // now cheking that if the user is login using google or not 
      // if the user is login using google then we will store the user in our database
      // so that we can use the user data in our application
      
      if (account.provider === "google") {
        try {
          await connectDB();
          // but check that if the user is already present in our database or not
          let existingUser = await User.findOne({ email: user.email });
          // encrypting "password"
          const hashsedPassword = await bcrypt.hash("password", 10);
          // may be any other way - I am doing this to avoid password field to be empty 
          // this may be handled when I will update the user profile 
          // we will ask them to change theie password and then we will update the password according to them
          //    have a looooook on this //////////////////////////
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
    // in session we can also ahve token and in  token we can also have user data
    // returning the user is not a good practice because user can also contains  password 
    // need to check /////////////////
    
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

// handler is the main thing 
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

