-- CreateTable
CREATE TABLE "QuickNote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "QuickNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
