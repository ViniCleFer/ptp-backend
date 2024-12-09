import { Divergencia, TipoDivergencia, File } from '@prisma/client';

export class DivergenciaEntity implements Divergencia {
  id: string;
  tipoDivergencia: TipoDivergencia;
  evidencias: File[];
  skuFaltandoFisicamente: string | null;
  qtdFaltandoFisicamente: string | null;
  skuSobrandoFisicamente: string | null;
  qtdSobrandoFisicamente: string | null;
  skuRecebemosFisicamente: string | null;
  qtdRecebemosFisicamente: string | null;
  skuNotaFiscal: string | null;
  qtdNotaFiscal: string | null;
  proximoPasso: string;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
