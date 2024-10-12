/*
  Warnings:

  - You are about to drop the column `description` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "description";
