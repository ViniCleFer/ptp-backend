/*
  Warnings:

  - A unique constraint covering the columns `[form_ptp_id,enunciado]` on the table `forms_ptp_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forms_ptp_questions_form_ptp_id_enunciado_key" ON "forms_ptp_questions"("form_ptp_id", "enunciado");
