-- CreateTable
CREATE TABLE `Fiche` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `classe` VARCHAR(191) NOT NULL,
    `coursId` VARCHAR(191) NOT NULL,
    `coursName` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `anneeId` VARCHAR(191) NOT NULL,
    `notes` JSON NOT NULL,

    UNIQUE INDEX `Fiche_classe_coursId_periode_anneeId_key`(`classe`, `coursId`, `periode`, `anneeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
