/*
  Warnings:

  - You are about to drop the column `userId` on the `Barbershop` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_userId_fkey";

-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
