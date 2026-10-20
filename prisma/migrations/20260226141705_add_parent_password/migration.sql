/*
  Warnings:

  - Added the required column `password` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "password" TEXT NOT NULL;
