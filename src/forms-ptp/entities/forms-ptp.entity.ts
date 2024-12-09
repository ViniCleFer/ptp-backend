import { FormPtp } from '@prisma/client';

export class FormPtpEntity implements FormPtp {
  id: string;
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
