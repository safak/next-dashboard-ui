-- CreateTable
CREATE TABLE "StudentRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "previousSchool" TEXT,
    "lastGradeCompleted" TEXT,
    "medicalNotes" TEXT,
    "guardianName" TEXT NOT NULL,
    "guardianRelationship" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "contractVersion" TEXT NOT NULL,
    "contractSignature" TEXT NOT NULL,
    "contractSignedAt" DATETIME NOT NULL,
    "parentId" TEXT,
    "studentId" TEXT,
    "reviewedAt" DATETIME,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentRegistration_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentRegistration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StudentRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StudentSubjects" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StudentSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StudentSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RegistrationSubjects" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RegistrationSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentRegistration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RegistrationSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentNumber" TEXT,
    "parentId" TEXT,
    "classId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("address", "birthday", "bloodType", "classId", "createdAt", "email", "gradeId", "id", "img", "name", "parentId", "phone", "sex", "surname", "username") SELECT "address", "birthday", "bloodType", "classId", "createdAt", "email", "gradeId", "id", "img", "name", "parentId", "phone", "sex", "surname", "username" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StudentRegistration_studentNumber_key" ON "StudentRegistration"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentRegistration_studentId_key" ON "StudentRegistration"("studentId");

-- CreateIndex
CREATE INDEX "StudentRegistration_status_idx" ON "StudentRegistration"("status");

-- CreateIndex
CREATE INDEX "StudentRegistration_username_idx" ON "StudentRegistration"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentSubjects_AB_unique" ON "_StudentSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentSubjects_B_index" ON "_StudentSubjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RegistrationSubjects_AB_unique" ON "_RegistrationSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_RegistrationSubjects_B_index" ON "_RegistrationSubjects"("B");

-- Give existing students a number (STU-<year joined>-0001, ...) so their
-- parents can register and link to them
UPDATE "Student" SET "studentNumber" = (
    SELECT 'STU-' || substr(s."createdAt", 1, 4) || '-' || printf('%04d', s.rn)
    FROM (
        SELECT "id", "createdAt",
               ROW_NUMBER() OVER (PARTITION BY substr("createdAt", 1, 4) ORDER BY "createdAt", "id") AS rn
        FROM "Student"
    ) s
    WHERE s."id" = "Student"."id"
)
WHERE "studentNumber" IS NULL;
