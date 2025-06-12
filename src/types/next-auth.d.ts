import { type DefaultSession, type User as DefaultUser } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';
import { type Role } from '@prisma/client'; // Import the Role enum from generated Prisma client

// Extend the default User type
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id: string; // Add the id field
      role: Role; // Add the role field
    } & DefaultSession['user']; // Keep existing fields like name, email, image
  }

  // Extend the default User type to include id and role from our Prisma model
  interface User extends DefaultUser {
    role: Role;
  }
}

// Extend the default JWT type
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string; // Add the id field
    role: Role; // Add the role field
  }
}
