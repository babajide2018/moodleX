import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.username as string },
              { email: credentials.username as string },
            ],
            deleted: false,
            suspended: false,
          },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastlogin: user.currentlogin,
            currentlogin: new Date(),
            lastaccess: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            avatar: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.firstname = dbUser.firstname;
          token.lastname = dbUser.lastname;
          token.role = dbUser.role;
          token.avatar = dbUser.avatar ?? undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
});
