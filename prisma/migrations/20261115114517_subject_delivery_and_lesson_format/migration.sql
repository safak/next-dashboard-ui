/*
  Warnings:

  - You are about to drop the `_RegistrationSubjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StudentSubjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_RegistrationSubjects_B_index";

-- DropIndex
DROP INDEX "_RegistrationSubjects_AB_unique";

-- DropIndex
DROP INDEX "_StudentSubjects_B_index";

-- DropIndex
DROP INDEX "_StudentSubjects_AB_unique";


-- CreateTable
CREATE TABLE "StudentSubject" (
    "studentId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "format" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "subjectId"),
    CONSTRAINT "StudentSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistrationSubject" (
    "registrationId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "format" TEXT NOT NULL,

    PRIMARY KEY ("registrationId", "subjectId"),
    CONSTRAINT "RegistrationSubject_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "StudentRegistration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RegistrationSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Carry over subjects chosen before lesson types existed (A = left model, B = Subject)
INSERT INTO "RegistrationSubject" ("registrationId", "subjectId", "format")
SELECT "A", "B", 'GROUP' FROM "_RegistrationSubjects";
INSERT INTO "StudentSubject" ("studentId", "subjectId", "format")
SELECT "A", "B", 'GROUP' FROM "_StudentSubjects";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_RegistrationSubjects";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_StudentSubjects";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "delivery" TEXT NOT NULL DEFAULT 'BOTH'
);
INSERT INTO "new_Subject" ("id", "name") SELECT "id", "name" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StudentSubject_subjectId_idx" ON "StudentSubject"("subjectId");

-- CreateIndex
CREATE INDEX "RegistrationSubject_subjectId_idx" ON "RegistrationSubject"("subjectId");
