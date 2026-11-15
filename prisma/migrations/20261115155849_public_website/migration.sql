-- CreateTable
CREATE TABLE "Enquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organisation" TEXT,
    "role" TEXT,
    "learners" INTEGER,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "schoolName" TEXT NOT NULL DEFAULT 'School Name',
    "academicYear" TEXT NOT NULL DEFAULT '2025/26',
    "registrationFee" INTEGER NOT NULL DEFAULT 0,
    "siblingDiscountPercent" INTEGER NOT NULL DEFAULT 0,
    "paymentDueDay" INTEGER NOT NULL DEFAULT 7,
    "bankDetails" TEXT,
    "tagline" TEXT,
    "aboutText" TEXT,
    "missionText" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "address" TEXT,
    "whatsapp" TEXT,
    "officeHours" TEXT,
    "showFeesPublicly" BOOLEAN NOT NULL DEFAULT false,
    "brandColor" TEXT NOT NULL DEFAULT '#4f46e5',
    "logoFile" TEXT
);
INSERT INTO "new_Setting" ("academicYear", "bankDetails", "id", "paymentDueDay", "registrationFee", "schoolName", "siblingDiscountPercent") SELECT "academicYear", "bankDetails", "id", "paymentDueDay", "registrationFee", "schoolName", "siblingDiscountPercent" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");
