/*
  Warnings:

  - You are about to drop the column `anomalias` on the `laudos_crm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "laudos_crm" DROP COLUMN "anomalias",
ADD COLUMN     "tiposNaoConformidade" "TipoNaoConformidade"[];
