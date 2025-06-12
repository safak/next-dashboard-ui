/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable - Add the username column as nullable first
ALTER TABLE "User" ADD COLUMN     "username" TEXT;

-- DATA MIGRATION START --
-- Populate the new username column for existing users
-- Using the part of the email before '@' as username, with a fallback
UPDATE "User"
SET "username" = COALESCE(
    CASE
        WHEN "email" LIKE '%@%' THEN substring("email" from 1 for position('@' in "email") - 1)
        ELSE "email" -- Use full email if no '@'
    END,
    'user_' || "id" -- Fallback if email is NULL, using the user ID
)
WHERE "username" IS NULL; -- Only update rows where username hasn't been set
-- DATA MIGRATION END --

-- AlterTable - Make the username column non-nullable AFTER populating it
-- Ensure all rows have a username before applying this constraint
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex - Add the unique constraint AFTER populating and making NOT NULL
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
