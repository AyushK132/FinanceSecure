/*
  Warnings:

  - You are about to drop the column `accountId` on the `budgets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_accountId_fkey";

-- DropIndex
DROP INDEX "budgets_accountId_idx";

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "accountId";

-- CreateIndex
CREATE UNIQUE INDEX "budgets_userId_key" ON "budgets"("userId");
