-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('US1', 'US2', 'US3');

-- CreateEnum
CREATE TYPE "UserNivel" AS ENUM ('UN1', 'UN2');

-- CreateEnum
CREATE TYPE "Enunciado" AS ENUM ('NUM_CAMADAS', 'LIMPEZA', 'PRESENCA_DATA_FABRICACAO', 'INTEGRIDADE_PALLET', 'AUSENCIA_VAZAMENTO', 'STRECH_FORRACAO', 'ETIQUETA_UC');

-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('T1', 'T2', 'T3');

-- CreateEnum
CREATE TYPE "TipoDivergencia" AS ENUM ('FALTA', 'SOBRA', 'INVERSAO');

-- CreateTable
CREATE TABLE "forms_ptp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dataExecucao" TIMESTAMP(3) NOT NULL,
    "conferente" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "opcaoUp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "forms_ptp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms_ptp_questions" (
    "id" TEXT NOT NULL,
    "form_ptp_id" TEXT NOT NULL,
    "enunciado" "Enunciado" NOT NULL,
    "qtdAnalisada" TEXT NOT NULL,
    "codProduto" TEXT NOT NULL,
    "naoConformidade" BOOLEAN NOT NULL DEFAULT false,
    "detalheNaoConformidade" TEXT NOT NULL,
    "qtdPalletsNaoConforme" TEXT NOT NULL,
    "qtdCaixasNaoConforme" TEXT NOT NULL,
    "necessitaCrm" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "forms_ptp_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laudos_crm" (
    "id" TEXT NOT NULL,
    "form_ptp_id" TEXT NOT NULL,
    "dt" TEXT NOT NULL,
    "transportador" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "nf" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "conferente" TEXT NOT NULL,
    "turno" "Turno" NOT NULL,
    "origem" TEXT NOT NULL,
    "anomalias" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "laudos_crm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divergencias" (
    "id" TEXT NOT NULL,
    "form_ptp_id" TEXT NOT NULL,
    "tipoDivergencia" "TipoDivergencia" NOT NULL,
    "skuFaltandoFisicamente" TEXT,
    "qtdFaltandoFisicamente" TEXT,
    "skuSobrandoFisicamente" TEXT,
    "qtdSobrandoFisicamente" TEXT,
    "skuRecebemosFisicamente" TEXT,
    "qtdRecebemosFisicamente" TEXT,
    "skuNotaFiscal" TEXT,
    "qtdNotaFiscal" TEXT,
    "proximoPasso" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "divergencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "doc" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'US1',
    "profile" "UserNivel" NOT NULL DEFAULT 'UN2',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencias" (
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

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id_entity" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "ip" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formPtpId" TEXT,
    "formPtpQuestionId" TEXT,
    "laudoCrmId" TEXT,
    "divergenciaId" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_refresh_token_key" ON "reset_password"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "codes_code_key" ON "codes"("code");

-- AddForeignKey
ALTER TABLE "forms_ptp_questions" ADD CONSTRAINT "forms_ptp_questions_form_ptp_id_fkey" FOREIGN KEY ("form_ptp_id") REFERENCES "forms_ptp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos_crm" ADD CONSTRAINT "laudos_crm_form_ptp_id_fkey" FOREIGN KEY ("form_ptp_id") REFERENCES "forms_ptp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divergencias" ADD CONSTRAINT "divergencias_form_ptp_id_fkey" FOREIGN KEY ("form_ptp_id") REFERENCES "forms_ptp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_laudoCrmId_fkey" FOREIGN KEY ("laudoCrmId") REFERENCES "laudos_crm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_divergenciaId_fkey" FOREIGN KEY ("divergenciaId") REFERENCES "divergencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_formPtpId_fkey" FOREIGN KEY ("formPtpId") REFERENCES "forms_ptp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_formPtpQuestionId_fkey" FOREIGN KEY ("formPtpQuestionId") REFERENCES "forms_ptp_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_laudoCrmId_fkey" FOREIGN KEY ("laudoCrmId") REFERENCES "laudos_crm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_divergenciaId_fkey" FOREIGN KEY ("divergenciaId") REFERENCES "divergencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
