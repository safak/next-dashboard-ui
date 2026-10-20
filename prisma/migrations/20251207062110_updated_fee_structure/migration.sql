/*
  Warnings:

  - A unique constraint covering the columns `[studentId,feeStructureId]` on the table `StudentFee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FeeStructure" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "referenceId" TEXT;

-- AlterTable
ALTER TABLE "StudentFee" ADD COLUMN     "isCleared" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "FeeStructure_classId_idx" ON "FeeStructure"("classId");

-- CreateIndex
CREATE INDEX "FeeStructure_type_idx" ON "FeeStructure"("type");

-- CreateIndex
CREATE INDEX "FeeStructure_term_idx" ON "FeeStructure"("term");

-- CreateIndex
CREATE INDEX "Payment_studentFeeId_idx" ON "Payment"("studentFeeId");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE INDEX "StudentFee_studentId_idx" ON "StudentFee"("studentId");

-- CreateIndex
CREATE INDEX "StudentFee_feeStructureId_idx" ON "StudentFee"("feeStructureId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFee_studentId_feeStructureId_key" ON "StudentFee"("studentId", "feeStructureId");
