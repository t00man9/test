/*
  Warnings:

  - You are about to drop the column `autoRenew` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `closeDate` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `openDate` on the `lottery` table. All the data in the column will be lost.
  - Added the required column `closeTime` to the `Lottery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openDays` to the `Lottery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `Lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lottery` DROP COLUMN `autoRenew`,
    DROP COLUMN `closeDate`,
    DROP COLUMN `openDate`,
    ADD COLUMN `closeTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `openDays` VARCHAR(191) NOT NULL,
    ADD COLUMN `openTime` VARCHAR(191) NOT NULL,
    MODIFY `isOpen` BOOLEAN NOT NULL DEFAULT false;
