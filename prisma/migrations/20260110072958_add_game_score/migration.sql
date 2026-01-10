-- CreateTable
CREATE TABLE "GameScore" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameType" TEXT NOT NULL,
    "selectedPokemonId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "obstaclesPassed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameScore_userId_gameType_idx" ON "GameScore"("userId", "gameType");

-- CreateIndex
CREATE INDEX "GameScore_gameType_score_idx" ON "GameScore"("gameType", "score");
