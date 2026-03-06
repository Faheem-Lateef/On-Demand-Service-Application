/*
  Warnings:

  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL;
