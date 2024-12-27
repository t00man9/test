/*
  Warnings:

  - You are about to alter the column `openDays` on the `lottery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `lottery` MODIFY `openDays` JSON NOT NULL;
