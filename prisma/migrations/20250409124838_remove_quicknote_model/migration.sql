/*
  Warnings:

  - You are about to drop the `QuickNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuickNote" DROP CONSTRAINT "QuickNote_userId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "quickNote" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "QuickNote";
