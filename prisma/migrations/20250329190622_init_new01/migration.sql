-- CreateEnum
CREATE TYPE "MemberSex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Itteration" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMESTERLY', 'ANNUALY', 'PERPETUALLY');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateTable
CREATE TABLE "Academy" (
    "id" SERIAL NOT NULL,
    "academyName" TEXT NOT NULL,
    "academyLogo" TEXT,
    "academyOwnerId" TEXT NOT NULL,
    "academyIsActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Academy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "latest002" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "img" TEXT,
    "bloodType" "BloodType",
    "isBloodDonor" BOOLEAN DEFAULT false,
    "sex" "MemberSex",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "img" TEXT,
    "bloodType" "BloodType",
    "isBloodDonor" BOOLEAN DEFAULT false,
    "sex" "MemberSex",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "img" TEXT,
    "bloodType" "BloodType",
    "isBloodDonor" BOOLEAN DEFAULT false,
    "sex" "MemberSex",

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "classDescription" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "day" "Day" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MartialArtsDiscipline" (
    "id" TEXT NOT NULL,
    "artName" TEXT NOT NULL,
    "artDescription" TEXT NOT NULL,

    CONSTRAINT "MartialArtsDiscipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Belt" (
    "id" TEXT NOT NULL,
    "beltName" TEXT NOT NULL,
    "martialArtsDisciplineId" TEXT NOT NULL,
    "instructorID" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Belt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certifications" (
    "id" TEXT NOT NULL,
    "certName" TEXT NOT NULL,
    "certDescription" TEXT NOT NULL,
    "certCircle" "Itteration" NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_username_key" ON "Member"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_username_key" ON "Parent"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_memberId_key" ON "Parent"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_username_key" ON "Instructor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MartialArtsDiscipline_artName_key" ON "MartialArtsDiscipline"("artName");

-- CreateIndex
CREATE UNIQUE INDEX "Belt_instructorID_key" ON "Belt"("instructorID");

-- CreateIndex
CREATE UNIQUE INDEX "Belt_memberId_key" ON "Belt"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Certifications_memberId_key" ON "Certifications"("memberId");

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Belt" ADD CONSTRAINT "Belt_martialArtsDisciplineId_fkey" FOREIGN KEY ("martialArtsDisciplineId") REFERENCES "MartialArtsDiscipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Belt" ADD CONSTRAINT "Belt_instructorID_fkey" FOREIGN KEY ("instructorID") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Belt" ADD CONSTRAINT "Belt_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certifications" ADD CONSTRAINT "Certifications_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
