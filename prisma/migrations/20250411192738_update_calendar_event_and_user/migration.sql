/*
  Warnings:

  - The values [TRAINING,SICK_LEAVE] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `personal` on the `Event` table. All the data in the column will be lost.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('MEETING', 'VACATION', 'OTHER', 'HOLIDAY');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "personal",
ADD COLUMN     "allDay" BOOLEAN,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vacationDays" INTEGER DEFAULT 20;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
