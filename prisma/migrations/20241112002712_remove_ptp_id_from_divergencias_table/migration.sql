/*
  Warnings:

  - You are about to drop the column `form_ptp_id` on the `divergencias` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "divergencias" DROP CONSTRAINT "divergencias_form_ptp_id_fkey";

-- AlterTable
ALTER TABLE "divergencias" DROP COLUMN "form_ptp_id";
