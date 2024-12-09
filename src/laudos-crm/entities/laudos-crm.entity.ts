import { LaudoCrm, Turno, File, TipoNaoConformidade } from '@prisma/client';

export class LaudoCrmEntity implements LaudoCrm {
  form_ptp_id: string;
  id: string;
  documentoTransporte: string;
  transportador: string;
  placa: string;
  notaFiscal: string;
  dataIdentificacao: Date;
  conferente: string;
  turno: Turno;
  origem: string;
  tiposNaoConformidade: TipoNaoConformidade[];
  evidencias: File[];
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
