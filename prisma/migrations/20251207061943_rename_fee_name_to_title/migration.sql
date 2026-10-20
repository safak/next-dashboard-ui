-- ✅ Rename existing column
ALTER TABLE "FeeStructure"
RENAME COLUMN "name" TO "title";

-- ✅ Add updatedAt with safe default
ALTER TABLE "FeeStructure"
ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();
