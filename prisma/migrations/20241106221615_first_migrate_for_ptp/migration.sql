/*
  Warnings:

  - You are about to drop the column `active` on the `forms_ptp` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `forms_ptp` table. All the data in the column will be lost.
  - You are about to drop the column `nota` on the `forms_ptp` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `laudos_crm` table. All the data in the column will be lost.
  - You are about to drop the column `dt` on the `laudos_crm` table. All the data in the column will be lost.
  - You are about to drop the column `nf` on the `laudos_crm` table. All the data in the column will be lost.
  - Added the required column `notaFiscal` to the `forms_ptp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataIdentificacao` to the `laudos_crm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentoTransporte` to the `laudos_crm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notaFiscal` to the `laudos_crm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forms_ptp" DROP COLUMN "active",
DROP COLUMN "name",
DROP COLUMN "nota",
ADD COLUMN     "notaFiscal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "laudos_crm" DROP COLUMN "data",
DROP COLUMN "dt",
DROP COLUMN "nf",
ADD COLUMN     "dataIdentificacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "documentoTransporte" TEXT NOT NULL,
ADD COLUMN     "notaFiscal" TEXT NOT NULL;
