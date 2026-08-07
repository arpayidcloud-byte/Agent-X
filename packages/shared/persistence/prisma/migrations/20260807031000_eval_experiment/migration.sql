-- CreateTable
CREATE TABLE "EvalExperiment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "providerA" TEXT NOT NULL,
    "modelA" TEXT NOT NULL,
    "providerB" TEXT NOT NULL,
    "modelB" TEXT NOT NULL,
    "scoreA" INTEGER NOT NULL,
    "scoreB" INTEGER NOT NULL,
    "winner" TEXT NOT NULL,
    "gradeA" TEXT NOT NULL,
    "gradeB" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvalExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvalExperiment_createdAt_idx" ON "EvalExperiment"("createdAt");

-- CreateIndex
CREATE INDEX "EvalExperiment_winner_idx" ON "EvalExperiment"("winner");
