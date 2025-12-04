-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "idempotencies" (
    "idempotency_key" VARCHAR(255) NOT NULL,
    "response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "idempotency_status" "IdempotencyStatus" NOT NULL,

    CONSTRAINT "idempotencies_pkey" PRIMARY KEY ("idempotency_key")
);
