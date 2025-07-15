/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,periodId,schoolYearId]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolYearId` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolYearId` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolYearId` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mark` ADD COLUMN `schoolYearId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `period` ADD COLUMN `schoolYearId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `semester` ADD COLUMN `schoolYearId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SchoolYear` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SchoolYear_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Mark_studentId_subjectId_periodId_schoolYearId_key` ON `Mark`(`studentId`, `subjectId`, `periodId`, `schoolYearId`);

-- AddForeignKey
ALTER TABLE `Semester` ADD CONSTRAINT `Semester_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Period` ADD CONSTRAINT `Period_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `Mark_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
