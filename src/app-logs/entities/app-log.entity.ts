import { Log } from '@prisma/client';

export class AppLogEntity implements Log {
  id: string;
  name: string;
  user_id: string;
  local: string;
  action: string;
  description: string;
  id_entity: string | null;
  new_value: any;
  old_value: any;
  ip: string;
  created_at: Date;
  formPtpId: string | null;
  formPtpQuestionId: string | null;
  laudoCrmId: string | null;
  divergenciaId: string | null;
}

export interface LogData {
  logs: AppLogEntity[];
  logsCount: number;
}
