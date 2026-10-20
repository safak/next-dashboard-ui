// src/lib/clerkAdmin.ts
import { createClerkClient } from "@clerk/backend";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Missing CLERK_SECRET_KEY in environment variables");
}

// Create an authenticated Clerk backend client
export const clerkAdmin = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
