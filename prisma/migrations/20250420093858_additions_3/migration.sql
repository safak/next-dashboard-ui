-- CreateTable
CREATE TABLE "_InstructorToMartialArtsDiscipline" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InstructorToMartialArtsDiscipline_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InstructorToMartialArtsDiscipline_B_index" ON "_InstructorToMartialArtsDiscipline"("B");

-- AddForeignKey
ALTER TABLE "_InstructorToMartialArtsDiscipline" ADD CONSTRAINT "_InstructorToMartialArtsDiscipline_A_fkey" FOREIGN KEY ("A") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorToMartialArtsDiscipline" ADD CONSTRAINT "_InstructorToMartialArtsDiscipline_B_fkey" FOREIGN KEY ("B") REFERENCES "MartialArtsDiscipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
