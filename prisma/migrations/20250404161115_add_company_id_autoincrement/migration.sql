-- DropIndex
DROP INDEX "Company_id_key";

-- AlterTable
CREATE SEQUENCE company_id_seq;
ALTER TABLE "Company" ALTER COLUMN "id" SET DEFAULT nextval('company_id_seq');
ALTER SEQUENCE company_id_seq OWNED BY "Company"."id";
