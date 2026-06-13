import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser } from "@/lib/userStore";
import { checkLocked, recordFailure, recordSuccess } from "@/lib/loginAttempts";

// On Vercel preview deployments NEXTAUTH_URL is not set; use VERCEL_URL as fallback.
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubConfigured =
  Boolean(githubClientId && githubClientSecret) &&
  !githubClientId?.startsWith("your_") &&
  !githubClientSecret?.startsWith("your_");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(githubConfigured
      ? [
          GitHubProvider({
            clientId: githubClientId!,
            clientSecret: githubClientSecret!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        const remaining = checkLocked(email);
        if (remaining > 0) {
          const minutes = Math.ceil(remaining / 60000);
          throw new Error(`LOCKED:${minutes}`);
        }

        const user = await verifyUser(email, password);
        if (!user) {
          recordFailure(email);
          throw new Error("INVALID_CREDENTIALS");
        }

        recordSuccess(email);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.id = user.id;
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },
  },
};
