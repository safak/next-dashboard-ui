/*
  Warnings:

  - You are about to drop the `ChecklistItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DesignChecklistItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesignChecklistItem" DROP CONSTRAINT "DesignChecklistItem_checklistItemId_fkey";

-- DropForeignKey
ALTER TABLE "DesignChecklistItem" DROP CONSTRAINT "DesignChecklistItem_designId_fkey";

-- DropForeignKey
ALTER TABLE "DesignChecklistItem" DROP CONSTRAINT "DesignChecklistItem_userId_fkey";

-- DropTable
DROP TABLE "ChecklistItem";

-- DropTable
DROP TABLE "DesignChecklistItem";
