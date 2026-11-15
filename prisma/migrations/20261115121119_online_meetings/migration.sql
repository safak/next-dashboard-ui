-- CreateTable
CREATE TABLE "OnlineMeeting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "joinUrl" TEXT NOT NULL,
    "passcode" TEXT,
    "externalId" TEXT,
    "lessonId" INTEGER,
    "extraClassId" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OnlineMeeting_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OnlineMeeting_extraClassId_fkey" FOREIGN KEY ("extraClassId") REFERENCES "ExtraClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OnlineMeeting_lessonId_key" ON "OnlineMeeting"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "OnlineMeeting_extraClassId_key" ON "OnlineMeeting"("extraClassId");
