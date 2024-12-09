/*
  Warnings:

  - The `anomalias` column on the `laudos_crm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoNaoConformidade" AS ENUM ('PALLET_COM_AVARIA', 'PALLET_COM_DIVERGENCIA_DE_LOTE', 'PALLET_COM_FALTA', 'PALLET_COM_STRECH_RASGADO', 'PALLET_COM_SUJIDADE', 'PALLET_DESALINHADO', 'PALLET_QUEBRADO');

-- AlterTable
ALTER TABLE "laudos_crm" DROP COLUMN "anomalias",
ADD COLUMN     "anomalias" "TipoNaoConformidade"[];
