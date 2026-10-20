/*
  Warnings:

  - You are about to drop the column `username` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_username_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "username";
