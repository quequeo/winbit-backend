import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import { prisma } from './prisma';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false;
        }
        
        // Verificar que el email esté en la lista de admins permitidos
        const userEmail = auth?.user?.email;
        if (!userEmail) {
          return false;
        }
        
        const allowedUser = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        
        if (!allowedUser) {
          // Retornar false para denegar acceso
          // El middleware redirigirá a /dashboard/unauthorized
          return false;
        }
        
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

