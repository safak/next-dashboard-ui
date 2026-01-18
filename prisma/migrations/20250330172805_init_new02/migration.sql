/*
  Warnings:

  - You are about to drop the column `latest002` on the `Admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MartialArtsDiscipline_artName_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "latest002",
ADD COLUMN     "latest003" TEXT NOT NULL DEFAULT '003';
