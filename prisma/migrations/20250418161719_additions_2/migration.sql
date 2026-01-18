-- AlterTable
ALTER TABLE "Academy" ADD COLUMN     "memberId" TEXT;

-- AddForeignKey
ALTER TABLE "Academy" ADD CONSTRAINT "Academy_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
