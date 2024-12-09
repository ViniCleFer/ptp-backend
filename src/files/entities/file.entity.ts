import { File } from '@prisma/client';

export class FileEntity implements File {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number | null;
  user_id: string;
  laudoCrmId: string | null;
  divergenciaId: string | null;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
