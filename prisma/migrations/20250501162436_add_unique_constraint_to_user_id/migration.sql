/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_userId_key" ON "Barbershop"("userId");
