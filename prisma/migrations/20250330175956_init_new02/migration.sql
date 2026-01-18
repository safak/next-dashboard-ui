/*
  Warnings:

  - You are about to drop the column `latest003` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "latest003",
ADD COLUMN     "latest002" TEXT NOT NULL DEFAULT '003';
