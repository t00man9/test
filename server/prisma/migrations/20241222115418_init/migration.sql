/*
  Warnings:

  - You are about to drop the column `autoOpenNextDay` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `closeTime` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `nextOpenDate` on the `lottery` table. All the data in the column will be lost.
  - Added the required column `autoOpenNext` to the `Lottery` table without a default value. This is not possible if the table is not empty.
  - Made the column `closeDate` on table `lottery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openDate` on table `lottery` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `lottery` DROP COLUMN `autoOpenNextDay`,
    DROP COLUMN `closeTime`,
    DROP COLUMN `isOpen`,
    DROP COLUMN `nextOpenDate`,
    ADD COLUMN `autoOpenNext` BOOLEAN NOT NULL,
    MODIFY `openTime` VARCHAR(191) NULL,
    MODIFY `closeDate` DATETIME(3) NOT NULL,
    MODIFY `openDate` DATETIME(3) NOT NULL;
