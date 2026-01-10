-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE INDEX "Pokemon_userId_idx" ON "Pokemon"("userId");
