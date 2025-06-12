/*
  Warnings:

  - A unique constraint covering the columns `[designId,checklistItemId]` on the table `DesignChecklistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DesignChecklistItem_designId_checklistItemId_key" ON "DesignChecklistItem"("designId", "checklistItemId");
