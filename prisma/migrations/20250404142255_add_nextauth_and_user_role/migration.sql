/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[designId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');

-- AlterTable - Add userId columns first (nullable)
ALTER TABLE "Design" ADD COLUMN     "userId" TEXT;
ALTER TABLE "Employee" ADD COLUMN     "userId" TEXT;
ALTER TABLE "Event" ADD COLUMN     "userId" TEXT;
ALTER TABLE "Note" ADD COLUMN     "userId" TEXT;

-- Create User table and NextAuth tables
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex for User table
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex for NextAuth tables
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- DATA MIGRATION START --
-- Step 1: Create User records from existing Employees
-- Using 'emp-' || id as the new User ID and copying relevant fields
-- Note: This assumes 'email', 'password', 'img' columns still exist at this point
INSERT INTO "User" ("id", "name", "email", "password", "image", "role", "createdAt", "updatedAt")
SELECT
    'emp-' || "id"::text,
    "username", -- Using username as the User's name
    "email",
    "password",
    "img",
    'EMPLOYEE', -- Defaulting all existing employees to EMPLOYEE role
    NOW(),      -- Or use Employee.createdAt if available and desired
    NOW()       -- Or use Employee.updatedAt if available and desired
FROM "Employee";

-- Step 2: Update Employee table to link to new User records
UPDATE "Employee" SET "userId" = 'emp-' || "id"::text;

-- Step 3: Update related tables (Design, Event, Note) to use the new User ID
-- Requires the original employeeId column to still exist
UPDATE "Design" SET "userId" = (SELECT "userId" FROM "Employee" WHERE "Employee"."id" = "Design"."employeeId");
UPDATE "Event" SET "userId" = (SELECT "userId" FROM "Employee" WHERE "Employee"."id" = "Event"."employeeId");
UPDATE "Note" SET "userId" = (SELECT "userId" FROM "Employee" WHERE "Employee"."id" = "Note"."employeeId");
-- DATA MIGRATION END --


-- Add Foreign Key constraints AFTER data migration
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Design" ADD CONSTRAINT "Design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; -- Changed from CASCADE to SET NULL based on schema
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; -- Changed from CASCADE to SET NULL based on schema

-- Add Unique constraints AFTER data migration
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");
CREATE UNIQUE INDEX "Note_designId_key" ON "Note"("designId"); -- This was in the original, keeping it

-- Make userId columns NOT NULL AFTER data migration and FK setup
-- Note: SET NULL on FKs for Design, Event, Note means userId can be NULL there, so no NOT NULL constraint needed for them.
ALTER TABLE "Employee" ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE "Design" ALTER COLUMN "userId" SET NOT NULL; -- Not needed due to SET NULL FK
-- ALTER TABLE "Event" ALTER COLUMN "userId" SET NOT NULL; -- Not needed due to SET NULL FK
-- ALTER TABLE "Note" ALTER COLUMN "userId" SET NOT NULL; -- Not needed due to SET NULL FK


-- Drop original Foreign Key constraints (if they weren't dropped earlier implicitly)
-- Prisma usually handles this, but being explicit can help avoid errors.
-- Check if these constraints exist before dropping if necessary.
-- ALTER TABLE "Design" DROP CONSTRAINT IF EXISTS "Design_employeeId_fkey";
-- ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_employeeId_fkey";
-- ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_employeeId_fkey";

-- Drop old columns AFTER data migration and setting up new relations
ALTER TABLE "Design" DROP COLUMN "employeeId";
ALTER TABLE "Employee" DROP COLUMN "email";
ALTER TABLE "Employee" DROP COLUMN "img";
ALTER TABLE "Employee" DROP COLUMN "password";
ALTER TABLE "Event" DROP COLUMN "employeeId";
ALTER TABLE "Note" DROP COLUMN "employeeId";

-- Drop original indexes AFTER data migration (if they weren't dropped earlier)
-- DROP INDEX IF EXISTS "Employee_email_key";

-- Drop Admin table
DROP TABLE "Admin";
