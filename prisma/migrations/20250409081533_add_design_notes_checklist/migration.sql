/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "notes" TEXT;

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignChecklistItem" (
    "id" SERIAL NOT NULL,
    "designId" INTEGER NOT NULL,
    "checklistItemId" INTEGER,
    "customText" TEXT,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignChecklistItem_designId_idx" ON "DesignChecklistItem"("designId");

-- CreateIndex
CREATE INDEX "DesignChecklistItem_checklistItemId_idx" ON "DesignChecklistItem"("checklistItemId");

-- CreateIndex
CREATE INDEX "DesignChecklistItem_userId_idx" ON "DesignChecklistItem"("userId");

-- AddForeignKey
ALTER TABLE "DesignChecklistItem" ADD CONSTRAINT "DesignChecklistItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignChecklistItem" ADD CONSTRAINT "DesignChecklistItem_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "ChecklistItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignChecklistItem" ADD CONSTRAINT "DesignChecklistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
