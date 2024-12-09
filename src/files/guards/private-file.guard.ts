import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FilesHelper } from '../files.helper';
import { FilesService } from '../files.service';

@Injectable()
export class PrivateFileGuard extends AuthGuard('jwt') {
  constructor(private readonly filesService: FilesService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const key = FilesHelper.getFileNameFromUrl(req.url);

    return this.checkPrivateFile(key, context);
  }

  private async checkPrivateFile(key: string, context: ExecutionContext) {
    return super.canActivate(context) as boolean;
  }
}
