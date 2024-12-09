/*
  Warnings:

  - You are about to drop the `evidencias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "evidencias" DROP CONSTRAINT "evidencias_divergenciaId_fkey";

-- DropForeignKey
ALTER TABLE "evidencias" DROP CONSTRAINT "evidencias_laudoCrmId_fkey";

-- DropForeignKey
ALTER TABLE "evidencias" DROP CONSTRAINT "evidencias_user_id_fkey";

-- DropTable
DROP TABLE "evidencias";

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "laudoCrmId" TEXT,
    "divergenciaId" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_laudoCrmId_fkey" FOREIGN KEY ("laudoCrmId") REFERENCES "laudos_crm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_divergenciaId_fkey" FOREIGN KEY ("divergenciaId") REFERENCES "divergencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
