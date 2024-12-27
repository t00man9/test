/*
  Warnings:

  - You are about to drop the column `betType` on the `bet` table. All the data in the column will be lost.
  - You are about to alter the column `gameType` on the `bet` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `bet` DROP COLUMN `betType`,
    MODIFY `gameType` VARCHAR(191) NOT NULL;
