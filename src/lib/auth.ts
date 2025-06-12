import { type NextAuthOptions, type User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma'; // Ensure prisma client is correctly imported
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          console.error('Missing username or password');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            password: true,
            image: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          console.error('No user found with this username or user has no password set.');
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          console.error('Invalid password for username:', credentials.username);
          return null;
        }

        console.log('Authorization successful for username:', user.username);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        } as NextAuthUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSessionData }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      const userId = token.id || token.sub;

      if (userId) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: userId as string },
            select: { name: true, email: true, image: true, role: true },
          });

          if (freshUser) {
            token.name = freshUser.name;
            token.email = freshUser.email;
            token.picture = freshUser.image;
            token.role = freshUser.role;
            if (!token.id) token.id = userId;
          } else {
            console.warn(`User with ID ${userId} not found in DB during JWT refresh.`);
          }
        } catch (error) {
          console.error('Error fetching fresh user data for JWT:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};
