-- DropIndex
DROP INDEX "Admin_username_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "lastActiveAt" TIMESTAMP(3);
