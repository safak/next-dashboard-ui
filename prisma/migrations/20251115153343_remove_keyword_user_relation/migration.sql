/*
  Warnings:

  - You are about to drop the column `userId` on the `Keyword` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Keyword" DROP CONSTRAINT "Keyword_userId_fkey";

-- AlterTable
ALTER TABLE "Keyword" DROP COLUMN "userId";
