-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "firebaseId" TEXT;

-- CreateTable
CREATE TABLE "MemberMetrics" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "dateofentry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "MemberMetrics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberMetrics" ADD CONSTRAINT "MemberMetrics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
