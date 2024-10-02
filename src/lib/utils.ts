import { auth } from "@clerk/nextjs/server";

const {userId,sessionClaims}= auth();
export const role = (sessionClaims?.metadata as {role?: string})?.role;
export const currentUserId=userId;