/*
  Warnings:

  - You are about to drop the column `createdAt` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `lottery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lottery` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `autoOpenNextDay` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `closeDate` DATETIME(3) NULL,
    ADD COLUMN `nextOpenDate` DATETIME(3) NULL,
    ADD COLUMN `openDate` DATETIME(3) NULL;
