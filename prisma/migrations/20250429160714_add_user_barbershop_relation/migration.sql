/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Barbershop` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_ownerId_fkey";

-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
