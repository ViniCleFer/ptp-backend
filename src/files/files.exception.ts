import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class GetSignedPutObjectException extends BadRequestException {
  constructor() {
    super('Erro ao lidar com a assinatura do upload');
  }
}

export class DeleteObjectException extends BadRequestException {
  constructor() {
    super('Erro ao deletar o arquivo');
  }
}

export class UnavailableFileException extends UnauthorizedException {
  constructor() {
    super('Arquivo indisponível');
  }
}

export class UpdateObjectMetadataException extends BadRequestException {
  constructor() {
    super('Problema ao atualizar os metadados do arquivo');
  }
}
