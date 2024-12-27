/*
  Warnings:

  - Added the required column `repeatInterval` to the `Lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lottery` ADD COLUMN `repeatInterval` INTEGER NOT NULL;
