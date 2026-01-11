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
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/login`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          );
          const { data } = response;

          if (data.status === "success") {
            return {
              username: data.data.username,
              role: data.data.role,
            };
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          throw new Error(error?.response?.data?.message || error.code)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        return { ...token, username: user.username, role: user.role};
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        username: token.username,
        role: token.role,
      };
      return session;
    },
  },
};
export default NextAuth(authOptions);
