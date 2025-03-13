import NextAuth, {
  AuthError,
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./lib/connectDB";
import { User } from "./models/userDetails";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

export const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin({
            cause: "Please provide email and password",
          });
        }

        const email = credentials.email;
        const password = credentials.password;

        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }

        console.log("USER ID", user._id);
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { id, name, email, image } = user;

          if (!email) {
            throw new AuthError("Email is required");
          }

          await connectToDatabase();

          let dbUser = await User.findOne({ email });
          if (!dbUser) {
            dbUser = await User.create({
              email,
              name,
              avatarUrl: image,
              googleId: id,
              role: "student", // Default role for new users
            });
          }

          user.role = dbUser.role; // Ensure role is passed to the token
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          throw new AuthError("Error while creating user");
        }
      }
      if (account?.provider === "credentials") return true;
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
