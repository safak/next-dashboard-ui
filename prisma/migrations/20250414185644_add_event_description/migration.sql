/*
  Warnings:

  - You are about to drop the column `description` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT;
