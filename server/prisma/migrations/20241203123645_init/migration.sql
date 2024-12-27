/*
  Warnings:

  - Added the required column `groupLotto` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bet` ADD COLUMN `groupLotto` VARCHAR(191) NOT NULL;
