/*
  Warnings:

  - You are about to drop the column `sentiment` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "sentiment",
ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sentiment",
ADD COLUMN     "category" TEXT;
