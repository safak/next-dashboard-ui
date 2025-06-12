/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `ChecklistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChecklistItem_text_key" ON "ChecklistItem"("text");
