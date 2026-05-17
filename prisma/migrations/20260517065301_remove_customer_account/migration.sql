/*
  Warnings:

  - You are about to drop the `CustomerAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerAccount" DROP CONSTRAINT "CustomerAccount_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAccount" DROP CONSTRAINT "CustomerAccount_workshopId_fkey";

-- DropTable
DROP TABLE "CustomerAccount";
