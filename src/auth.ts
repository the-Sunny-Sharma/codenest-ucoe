import NextAuth, {
  AuthError,
  CredentialsSignin,
  DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./lib/connectDB";
import { User } from "./models/userDetails";
import { compare } from "bcryptjs";

// Extend the built-in session types
interface ExtendedSession extends DefaultSession {
  user?: {
    id: string;
  } & DefaultSession["user"];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin({
            cause: "Please provide email and password",
          });
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
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

          //Only create user if they do not exist
          const isAlreadyUser = await User.findOne({ email });
          if (!isAlreadyUser) {
            await User.create({
              email,
              name,
              avatarUrl: image,
              googleId: id,
            });
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          throw new AuthError("Error while creating user");
        }
      }
      if (account?.provider === "credentials") return true;
      return false;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
