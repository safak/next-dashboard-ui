import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from 'next-auth'; // Import User type
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma'; // Corrected import: named export
import bcrypt from 'bcryptjs'; // Corrected import: use bcryptjs
import { authOptions } from '@/lib/auth'; // Import authOptions from the new location

const handler = NextAuth(authOptions); // This now uses the imported authOptions

export { handler as GET, handler as POST };
