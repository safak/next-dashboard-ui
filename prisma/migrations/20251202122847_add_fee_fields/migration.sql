/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('ADMISSION', 'TERM', 'ANNUAL', 'MISC');

-- CreateEnum
CREATE TYPE "TermType" AS ENUM ('TERM_1', 'TERM_2');

-- DropForeignKey
ALTER TABLE "FeeStructure" DROP CONSTRAINT "FeeStructure_classId_fkey";

-- DropIndex
DROP INDEX "StudentFee_studentId_feeStructureId_key";

-- AlterTable
ALTER TABLE "FeeStructure" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "term" "TermType",
ADD COLUMN     "type" "FeeType" NOT NULL DEFAULT 'ADMISSION',
ALTER COLUMN "classId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdAt",
DROP COLUMN "status",
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'Cash',
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
