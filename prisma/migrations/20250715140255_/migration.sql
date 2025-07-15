/*
  Warnings:

  - You are about to drop the column `schoolYearId` on the `period` table. All the data in the column will be lost.
  - You are about to drop the column `schoolYearId` on the `semester` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `period` DROP FOREIGN KEY `Period_schoolYearId_fkey`;

-- DropForeignKey
ALTER TABLE `semester` DROP FOREIGN KEY `Semester_schoolYearId_fkey`;

-- DropIndex
DROP INDEX `Period_schoolYearId_fkey` ON `period`;

-- DropIndex
DROP INDEX `Semester_schoolYearId_fkey` ON `semester`;

-- AlterTable
ALTER TABLE `fee` ADD COLUMN `schoolYearId` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `schoolYearId` INTEGER NULL;

-- AlterTable
ALTER TABLE `period` DROP COLUMN `schoolYearId`;

-- AlterTable
ALTER TABLE `semester` DROP COLUMN `schoolYearId`;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
