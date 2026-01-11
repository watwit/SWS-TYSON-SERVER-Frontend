import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.accessToken && credentials?.refreshToken) {
          // Refresh scenario
          return {
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            username: credentials.username,
            role: credentials.role,
          };
        }

        // Normal login
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          );

          const { data } = response;

          if (data.status !== "success") return null;

          return {
            refreshToken: data.data.refreshToken,
            accessToken: data.data.accessToken,
            username: data.data.username,
            role: data.data.role,
          };
        } catch (error) {
          throw new Error(error?.response?.data?.message || error.message);
        }
      },
    }),
  ],

  // ✅ These MUST be outside of providers
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.username = user.username;
        token.role = user.role ?? token.role;
      }

      if (trigger === "update") {
        token.accessToken = session.user.accessToken;
        token.refreshToken = session.user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        refreshToken: token.refreshToken,
        accessToken: token.accessToken,
        username: token.username,
        role: token.role,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
