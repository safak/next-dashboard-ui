/*
  Warnings:

  - You are about to drop the column `notes` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "notes",
ADD COLUMN     "designNotes" TEXT;
