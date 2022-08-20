import NextAuth, { type NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error(`Credentials are missing`);
          throw new Error("Credentials are missing");
        }

        if (
          credentials.email !== "test@test.com" ||
          credentials.password === "test12345"
        ) {
          throw new Error("Invalid credentials");
        }

        return {
          id: "test-id-1",
          email: "test@test.com",
          name: "Test user",
          userRole: "admin",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userRole = user.userRole as string;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          userRole: token.userRole as string,
          image: null,
        },
      };

      return sess;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same domain
      else if (new URL(url).hostname === new URL(baseUrl).hostname) return url;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
