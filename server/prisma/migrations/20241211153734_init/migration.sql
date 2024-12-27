/*
  Warnings:

  - You are about to drop the column `enabled` on the `lottery` table. All the data in the column will be lost.
  - You are about to drop the column `repeatInterval` on the `lottery` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lottery` DROP COLUMN `enabled`,
    DROP COLUMN `repeatInterval`,
    ADD COLUMN `autoRenew` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
