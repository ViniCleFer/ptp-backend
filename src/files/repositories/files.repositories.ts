import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

import { NotFoundError } from '../../common/errors/types/NotFoundError';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { UploadPublicFileAppDto } from '../dto/upload-public-file-app.dto';

import { FileEntity } from '../entities/file.entity';

import { AppLogsService } from 'src/app-logs/app-logs.service';
import { removerExtensao } from 'src/utils/mimetypes';

@Injectable()
export class FilesRepository {
  private logger = new Logger(FilesRepository.name);
  private s3Client: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly appLogsService: AppLogsService,
  ) {
    this.s3Client = new S3Client({
      region: this.config.get<string>('AWS_S3_STORAGE_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_S3_STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>(
          'AWS_S3_STORAGE_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  private signedUrlExpiredSeconds = 60 * 1;

  private allowedMimeTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/zip',
    'application/gzip',
    'application/xhtml+xml',
    'application/xml',
    'image/jpg',
    'image/svg+xml',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  private s3Connection(): S3 {
    return new S3({
      region: this.config.get<string>('AWS_S3_STORAGE_REGION'),
      accessKeyId: this.config.get<string>('AWS_S3_STORAGE_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get<string>(
        'AWS_S3_STORAGE_SECRET_ACCESS_KEY',
      ),
      endpoint: this.config.get<string>('AWS_S3_STORAGE_ENDPOINT'),
    });
  }

  private getBucketName() {
    return this.config.get('AWS_S3_STORAGE_AVATAR_BUCKET_NAME');
  }

  public getFileSignature(key: string) {
    const url = this.s3Connection().getSignedUrl('getObject', {
      Bucket: this.getBucketName(),
      Key: key,
      Expires: this.signedUrlExpiredSeconds,
    });

    return url;
  }

  private generateFileKey(originalName: string, folderName: string): string {
    const extension = originalName.split('.').pop();
    const fileName = `${uuid()}.${extension}`;
    return `${folderName}/${fileName}`;
  }

  async uploadPublicFile(
    file: Express.Multer.File,
    userId: string,
    folderName: string,
    companyId: string,
    ip: string,
  ): Promise<FileEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado.');
      }

      const s3Client = this.s3Connection();
      const { size, originalname, mimetype } = file;
      const key = this.generateFileKey(originalname, folderName);
      const bucketName = this.getBucketName();

      if (!this.allowedMimeTypes.includes(mimetype)) {
        throw new HttpException(
          `Invalid File type`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const responseFileS3 = await s3Client
        .upload({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: mimetype,
          ACL: 'public-read',
        })
        .promise();

      if (responseFileS3.Location) {
        const fileSaved = await this.prisma.file.create({
          data: {
            filename: originalname,
            mimetype,
            size,
            url: `https://${bucketName}.s3.amazonaws.com/${key}`,
            user_id: userId,
          },
        });

        await this.appLogsService.createLog({
          name: user.name,
          user_id: user.id,
          local: 'Arquivos',
          action: 'Criou',
          description: `Upload do arquivo "${originalname}"`,
          ip,
          id_entity: fileSaved.id,
        });

        return fileSaved;
      }
    } catch (error) {
      this.logger.error(error, 'Error uploadPublicFile');
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadPublicFileApp(
    uploadPublicFileAppDto: UploadPublicFileAppDto,
    userId: string,
    companyId: string,
    ip: string,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado.');
      }

      const s3Client = this.s3Connection();
      const { size, original_name, mimetype, base64_file } =
        uploadPublicFileAppDto;
      const key = this.generateFileKey(original_name, 'avatar');
      const bucketName = this.getBucketName();

      if (!this.allowedMimeTypes.includes(mimetype)) {
        throw new HttpException(
          `Invalid File type`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      let base64Image = '';

      if (base64_file.includes(';base64,')) {
        base64Image = base64_file.split(';base64,').pop();
      } else {
        base64Image = base64_file;
      }

      const fileBuffer = Buffer.from(base64Image, 'base64');

      const responseFileS3 = await s3Client
        .upload({
          Bucket: bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: mimetype,
          ACL: 'public-read',
        })
        .promise();

      // if (responseFileS3.Location) {
      // let fileSaved;
      // const url = `https://${bucketName}.s3.amazonaws.com/${key}`;

      // if (user?.avatar_url !== null && typeof user?.avatar_url === 'string') {
      //   const file = await this.prisma.file.findFirst({
      //     where: {
      //       user_id: user?.id,
      //     },
      //   });

      //   this.s3Connection().deleteObject({
      //     Bucket: bucketName,
      //     Key: key,
      //   });

      //   fileSaved = await this.prisma.file.update({
      //     where: {
      //       id: file.id,
      //     },
      //     data: {
      //       key,
      //       url,
      //     },
      //   });

      //   await this.appLogsService.createLog({
      //     name: user?.name,
      //     user_id: user.id,
      //     company_id: company.id,
      //     local: 'Arquivos',
      //     action: 'Alterou',
      //     description: `Upload do arquivo "${filename}"`,
      //     ip,
      //     id_entity: fileSaved.id,
      //   });
      // } else {
      //   fileSaved = this.prisma.file.create({
      //     data: {
      //       key,
      //       filename: filename,
      //       mimetype,
      //       size,
      //       url,
      //       is_public: true,
      //       user_id: userId,
      //       company_id: companyId,
      //     },
      //   });

      //   await this.appLogsService.createLog({
      //     name: user?.name,
      //     user_id: user.id,
      //     company_id: company.id,
      //     local: 'Arquivos',
      //     action: 'Criou',
      //     description: `Upload do arquivo "${filename}"`,
      //     ip,
      //     id_entity: fileSaved.id,
      //   });
      // }

      //   return fileSaved;
      // }
    } catch (error) {
      this.logger.error(error, 'Error uploadPublicFileApp');
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async uploadPrivateFile(
  //   file: Express.Multer.File,
  //   userId: string,
  // ): Promise<FileEntity> {
  //   try {
  //     const bucketName = this.getBucketName();
  //     const { size, originalname, mimetype } = file;
  //     const key = this.generateFileKey(originalname, 'private');

  //     if (!this.allowedMimeTypes.includes(mimetype)) {
  //       throw new HttpException(
  //         `Invalid File type`,
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     this.s3Connection()
  //       .upload({
  //         Bucket: bucketName,
  //         Key: key,
  //         Body: file.buffer,
  //         ContentType: mimetype,
  //       })
  //       .promise();

  //     const fileSaved = this.prisma.file.create({
  //       data: {
  //         key,
  //         filename: originalname,
  //         mimetype,
  //         size,
  //         is_public: false,
  //         is_downloaded: false,
  //         user_id: userId,
  //         company_id: companyId,
  //       },
  //     });

  //     return fileSaved;
  //   } catch (error) {
  //     throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getFileDownloadTempUrl(id: string) {
    if (!id) return;
    const fileFounded = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!fileFounded) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    const { url } = fileFounded;
    const bucketName = this.getBucketName();

    // if (is_public) {
    //   throw new InternalServerErrorException(
    //     'Método usado somente para arquivos privados.',
    //   );
    // }

    const cmd = new GetObjectCommand({
      Bucket: bucketName,
      Key: url,
    });

    const signedUrl = await getSignedUrl(this.s3Client, cmd, {
      expiresIn: this.signedUrlExpiredSeconds, // expiresIn = seconds
    });

    return { ...fileFounded, url: signedUrl };
  }

  async deleteFile(id: string) {
    try {
      if (!id) return;
      const fileFounded = await this.prisma.file.findUnique({
        where: { id },
      });

      if (!fileFounded) {
        throw new NotFoundError('Arquivo não encontrado.');
      }

      const { url } = fileFounded;
      const backetName = this.getBucketName();

      this.s3Connection().deleteObject({
        Bucket: backetName,
        Key: url,
      });

      return await this.prisma.file.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error, 'Error ao deletar file');
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //   async create(createFileDto: CreateFileDto): Promise<FileEntity> {
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: createFileDto.user_id },
  //     });

  //     if (!user) {
  //       throw new NotFoundError('Usuário não encontrado.');
  //     }

  //     const isPublic = createFileDto.is_public;
  //     const acl = isPublic ? 'public-read' : 'private';

  //     const uploadResult = await this.s3Connection()
  //       .upload({
  //         Bucket: this.getBucketName(),
  //         Body: createFileDto.dataBuffer,
  //         Key: createFileDto.key,
  //         ACL: acl,
  //         CacheControl: 'public,max-age=290304000',
  //       })
  //       .promise();

  //     delete createFileDto.dataBuffer;
  //     delete createFileDto.url;

  //     const url = this.getFileSignature(createFileDto.key);

  //     const file = {
  //       key: uploadResult.Key,
  //       owner: {
  //         id: createFileDto.user_id,
  //       },
  //       // uploadResult,
  //       url,
  //       ...createFileDto,
  //     };

  //     const newFile = this.prisma.file.create({ data: file });

  //     return newFile;
  //     // return file as any;
  //   }

  //   async findAll(): Promise<FileEntity[]> {
  //     return await this.prisma.file.findMany();
  //   }

  async findById(id: string, userId: string): Promise<FileEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const file = await this.prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    return file;
  }

  //   async findByFolderId(id: string): Promise<FileEntity[]> {
  //     const folderExists = this.prisma.folder.findUnique({ where: { id } });

  //     if (!folderExists) {
  //       throw new NotFoundError('Pasta não encontrada.');
  //     }

  //     const files = await this.prisma.file.findMany({
  //       where: {
  //         folder_id: id,
  //       },
  //     });

  //     return files;
  //   }

  //   async update(id: string, updateFileDto: UpdateFileDto): Promise<FileEntity> {
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: updateFileDto.user_id },
  //     });

  //     if (!user) {
  //       throw new NotFoundError('Usuário não encontrado.');
  //     }

  //     const file = await this.prisma.file.update({
  //       where: {
  //         id,
  //       },
  //       data: { ...updateFileDto },
  //     });

  //     return file;
  //   }

  //   async remove(id: string): Promise<FileEntity> {
  //     return await this.prisma.file.update({
  //       where: {
  //         id,
  //       },
  //       data: {
  //         canceled_at: new Date(),
  //       },
  //     });
  //   }

  //   async delete(id: string): Promise<FileEntity> {
  //     const fileDeleted = await this.prisma.file.findUnique({
  //       where: {
  //         id,
  //       },
  //     });

  //     const bucketName = this.getBucketName();

  //     await this.s3Connection()
  //       .deleteObject({
  //         Bucket: bucketName,
  //         Key: fileDeleted.key,
  //       })
  //       .promise();

  //     return await this.prisma.file.delete({
  //       where: {
  //         id,
  //       },
  //     });
  //   }

  // TEMPORARIA

  async create(
    createFileDto: CreateFileDto,
    userId: string,
    companyId: string,
    ip: string,
    isTheme?: string,
  ): Promise<FileEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const newFile = await this.prisma.file.create({
      data: {
        ...(createFileDto as any),
        filename: removerExtensao(createFileDto.original_name),
        mimetype: 'application/pdf',
        company_id: companyId,
      },
    });

    if (isTheme !== 'true') {
      await this.appLogsService.createLog({
        name: user.name,
        user_id: user.id,
        local: 'Arquivos',
        action: 'Criou',
        description: `Upload do arquivo "${newFile.filename}"`,
        ip,
        id_entity: newFile.id,
      });
    }

    return newFile;
  }

  async findAll() {
    return await this.prisma.file.findMany();
  }

  async uploadFiles(
    file: Express.Multer.File,
    folderId: string,
    userId: string,
    key: string,
  ) {
    const fileCreated = await this.prisma.file.create({
      data: {
        url: key,
        size: file.size,
        mimetype: file.mimetype,
        filename: file.originalname,
        user_id: userId,
      },
    });
    return fileCreated;
  }

  // async scriptAdjustAllKeysOnFiles(userId: string, companyId: string) {
  //   const allFiles = await this.prisma.file.findMany();

  //   function temEspaco(str) {
  //     return /\s/.test(str);
  //   }

  //   for (const file of allFiles) {
  //     if (temEspaco(file.key)) {
  //       await this.prisma.$transaction(async prisma => {
  //         const actualKey = file.key;
  //         const url = this.config.get<string>('BACKEND_API_URL');

  //         const fileBuffer = await this.httpService.axiosRef.get(
  //           `${url}/files/${file.key}`,
  //           {
  //             headers: {
  //               userId,
  //               companyId,
  //             },
  //           },
  //         );

  //         const s3Object = await this.fileService.signedPutObject({
  //           filename: file.filename,
  //           mimetype: file.mimetype,
  //           newFilename: file.filename,
  //           folder: undefined,
  //           metadata: undefined,
  //         });

  //         await this.httpService.axiosRef.put(s3Object.url, fileBuffer, {
  //           headers: {
  //             'Content-Type': file.mimetype,
  //           },
  //         });

  //         await prisma.file.update({
  //           where: { id: file.id },
  //           data: {
  //             key: s3Object.key,
  //             url: s3Object.url,
  //           },
  //         });

  //         await this.fileService.deleteS3Object(actualKey);
  //       });
  //     }
  //   }

  //   return 'success';
  // }

  async update(
    id: string,
    updateFileDto: UpdateFileDto,
    userId: string,
    ip: string,
  ): Promise<FileEntity> {
    const fileExists = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!fileExists) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const file = await this.prisma.file.update({
      where: {
        id,
      },
      data: { ...(updateFileDto as any) },
    });

    await this.appLogsService.createLog({
      name: user.name,
      user_id: user.id,
      local: 'Arquivos',
      action: 'Alterou',
      description: `Arquivo alterado`,
      old_value: fileExists,
      new_value: file,
      ip,
      id_entity: file.id,
    });

    return file;
  }

  async remove(
    id: string,
    companyId: string,
    userId: string,
    ip?: string,
  ): Promise<FileEntity> {
    const fileExists = await this.prisma.file.findUnique({
      where: { id },
      select: {
        id: true,
        filename: true,
      },
    });

    if (!fileExists) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    await this.appLogsService.createLog({
      name: userExists.name,
      user_id: userExists.id,
      local: 'Arquivos',
      action: 'Deletou',
      description: `Deletou o arquivo "${fileExists?.filename}"`,
      ip,
      id_entity: fileExists?.id,
    });

    const removedFile = await this.prisma.file.update({
      where: {
        id,
      },
      data: {
        canceled_at: new Date(),
      },
    });

    return removedFile;
  }

  async delete(
    key: string,
    userId: string,
    companyId: string,
    fileId: string,
    ip: string,
  ): Promise<FileEntity> {
    const fileExists = await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!fileExists || fileExists.url !== key) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const file = await this.prisma.file.delete({
      where: {
        id: fileExists.id,
      },
    });

    await this.appLogsService.createLog({
      name: userExists.name,
      user_id: userExists.id,
      local: 'Arquivos',
      action: 'Deletou',
      description: `Deletou o arquivo "${fileExists.filename}"`,
      ip,
      id_entity: fileExists.id,
    });

    return file;
  }

  async deleteFileFromQueue(
    key: string,
    userId: string,
    userName: string,
    fileId: string,
    ip: string,
  ): Promise<FileEntity> {
    const fileExists = await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!fileExists || fileExists?.url !== key) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    const file = await this.prisma.file.delete({
      where: {
        id: fileExists.id,
      },
    });

    await this.appLogsService.createLog({
      name: userName,
      user_id: userId,
      local: 'Arquivos',
      action: 'Deletou',
      description: `Deletou o arquivo "${fileExists.filename}"`,
      ip,
      id_entity: fileExists.id,
    });

    return file;
  }
}
