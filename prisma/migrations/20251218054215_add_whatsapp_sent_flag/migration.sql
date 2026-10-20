/*
  Warnings:

  - You are about to drop the column `description` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "description",
ADD COLUMN     "whatsappSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsappSentAt" TIMESTAMP(3);
