/*
  Warnings:

  - Added the required column `area` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT;

-- CreateIndex
CREATE INDEX "Address_area_idx" ON "Address"("area");

-- CreateIndex
CREATE INDEX "Address_state_idx" ON "Address"("state");
