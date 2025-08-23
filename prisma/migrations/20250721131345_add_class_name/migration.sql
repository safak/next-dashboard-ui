/*
  Warnings:

  - You are about to drop the column `classe` on the `fiche` table. All the data in the column will be lost.
  - You are about to drop the column `periode` on the `fiche` table. All the data in the column will be lost.
  - You are about to alter the column `coursId` on the `fiche` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `anneeId` on the `fiche` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[classId,coursId,periodId,anneeId]` on the table `Fiche` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anneeName` to the `Fiche` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Fiche` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classeName` to the `Fiche` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Fiche` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodeName` to the `Fiche` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Fiche_classe_coursId_periode_anneeId_key` ON `fiche`;

-- AlterTable
ALTER TABLE `fiche` DROP COLUMN `classe`,
    DROP COLUMN `periode`,
    ADD COLUMN `anneeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `classId` INTEGER NOT NULL,
    ADD COLUMN `classeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `periodId` INTEGER NOT NULL,
    ADD COLUMN `periodeName` VARCHAR(191) NOT NULL,
    MODIFY `coursId` INTEGER NOT NULL,
    MODIFY `anneeId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Fiche_classId_coursId_periodId_anneeId_key` ON `Fiche`(`classId`, `coursId`, `periodId`, `anneeId`);
