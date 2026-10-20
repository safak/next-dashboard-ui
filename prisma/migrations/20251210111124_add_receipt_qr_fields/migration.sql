/*
  Warnings:

  - A unique constraint covering the columns `[receiptNo]` on the table `StudentFee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verifyHash]` on the table `StudentFee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StudentFee" ADD COLUMN     "receiptNo" TEXT,
ADD COLUMN     "verifyHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StudentFee_receiptNo_key" ON "StudentFee"("receiptNo");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFee_verifyHash_key" ON "StudentFee"("verifyHash");
