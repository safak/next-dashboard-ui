/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `employeeId` on the `Design` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `employeeId` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `employeeId` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'WAITING', 'NOT_SEND', 'SEND', 'DONE');

-- DropForeignKey
ALTER TABLE "Design" DROP CONSTRAINT "Design_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_employeeId_fkey";

-- AlterTable
ALTER TABLE "Design" DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
