/*
  Warnings:

  - The `mode` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isCleared` on the `StudentFee` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `StudentFee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'CARD', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "mode",
ADD COLUMN     "mode" "PaymentMode" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "StudentFee" DROP COLUMN "isCleared",
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "paidAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "StudentFee_status_idx" ON "StudentFee"("status");
