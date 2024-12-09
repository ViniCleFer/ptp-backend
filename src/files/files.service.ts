import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import * as ms from 'ms';
import * as path from 'path';
import { S3 } from 'aws-sdk';
import { nanoid } from 'nanoid';
import * as util from 'node:util';
import { Readable } from 'stream';
import { PDFDocument, degrees, rgb } from 'pdf-lib';
import { HttpService } from '@nestjs/axios';
import * as libre from 'libreoffice-convert';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import * as dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';

import {
  DeleteObjectException,
  GetSignedPutObjectException,
  UpdateObjectMetadataException,
} from './files.exception';
import { SignedPutObject } from './files.interface';

import { PutObjectDto } from './dto/put-object.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadPublicFileAppDto } from './dto/upload-public-file-app.dto';
import { UpdateObjectMetadataDto } from './dto/update-object-metadata.dto';

import { FileEntity } from './entities/file.entity';

import { PrismaService } from '../prisma/prisma.service';

import { FilesRepository } from './repositories/files.repositories';

import { NotFoundError } from '../common/errors/types/NotFoundError';
import { removeSpecialCharsAndAccents } from './files.helper';

@Injectable()
export class FilesService {
  private logger = new Logger(FilesService.name);

  constructor(
    private configService: ConfigService,
    private readonly repository: FilesRepository,
    private httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private ONE_MINUTE_IN_SECONDS = ms('10m') / 1000;

  private convertAsync = util.promisify(libre.convert);

  async convertToPDF(file: Buffer, fileName: string) {
    await writeFile(`${__dirname}/${fileName}`, file);

    const fileBytes = await readFile(`${__dirname}/${fileName}`);

    const extension = '.pdf';

    const pdfBuf = await this.convertAsync(fileBytes, extension, undefined);

    await writeFile(`${__dirname}/${fileName}.pdf`, pdfBuf);

    const filePdf = await readFile(`${__dirname}/${fileName}.pdf`);
    const existingPdfDoc = await PDFDocument.load(filePdf);

    await unlink(`${__dirname}/${fileName}`);
    await unlink(`${__dirname}/${fileName}.pdf`);

    const pdfBase64 = await existingPdfDoc.saveAsBase64();

    return pdfBase64;
  }

  async upload(
    file: Express.Multer.File,
    userId: string,
    folder: string,
    ip: string,
  ) {
    const supabaseURL = process.env.SUPABASE_PROJECT_URL;
    const supabaseKEY = process.env.SUPABASE_API_KEY;

    const supabase = createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    });

    const data = await supabase.storage
      .from(`evidencias/${folder}`)
      .upload(file.originalname, file.buffer, {
        upsert: true,
      });

    return data;
  }

  // // async convertToPdfToWord(file: Buffer, fileName: string) {
  // //   const pdfDoc = await PDFDocument.create();

  // //   await writeFile(`${__dirname}/${fileName}`, file, 'base64');

  // //   await docxConverter(
  // //     `${__dirname}/${fileName}`,
  // //     `${__dirname}/${fileName}.pdf`,
  // //     function (err, result) {
  // //       if (err) {
  // //         console.log(err);
  // //       }
  // //       console.log('result' + result);
  // //     },
  // //   );

  // //   const filePdf = await readFile(`${__dirname}/${fileName}.pdf`, 'base64');
  // //   const existingPdfDoc = await PDFDocument.load(filePdf);

  // //   const pages = await pdfDoc.copyPages(
  // //     existingPdfDoc,
  // //     existingPdfDoc.getPageIndices(),
  // //   );
  // //   pages.forEach(page => pdfDoc.addPage(page));

  // //   await unlink(`${__dirname}/${fileName}`);
  // //   await unlink(`${__dirname}/${fileName}.pdf`);

  // //   const pdfBase64 = await pdfDoc.saveAsBase64();

  // //   return pdfBase64;
  // // }

  // async signedPutObject(putObjectDto: PutObjectDto): Promise<SignedPutObject> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   const isPdfFile = putObjectDto.mimetype === 'application/pdf';

  //   const key = this.createKey(
  //     putObjectDto.filename,
  //     putObjectDto.folder,
  //     putObjectDto.newFilename,
  //   );

  //   const keyPdf = key + '.pdf';

  //   try {
  //     const url = await s3Client.getSignedUrlPromise('putObject', {
  //       Bucket: awsS3Bucket,
  //       Key: keyPdf,
  //       Expires: this.ONE_MINUTE_IN_SECONDS,
  //       ContentType: putObjectDto.mimetype,
  //       Metadata: putObjectDto.metadata,
  //     });

  //     if (typeof putObjectDto.file === 'string') {
  //       let base64Image = '';
  //       if (putObjectDto.file.includes(';base64,')) {
  //         base64Image = putObjectDto.file.split(';base64,').pop();
  //       } else {
  //         base64Image = putObjectDto.file;
  //       }

  //       let fileBuffer = Buffer.from(base64Image, 'base64');

  //       if (!isPdfFile) {
  //         const convertedFile = await this.convertToPDF(
  //           fileBuffer,
  //           putObjectDto.filename,
  //         );

  //         fileBuffer = Buffer.from(convertedFile, 'base64');
  //       }

  //       await this.httpService.axiosRef.put(url, fileBuffer, {
  //         headers: {
  //           'Content-Type': 'application/pdf',
  //         },
  //       });
  //     }
  //     return { url, key: keyPdf };
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao assinar o upload do arquivo');
  //     throw new GetSignedPutObjectException();
  //   }
  // }

  // async signedPutZipObject(
  //   putObjectDto: PutObjectDto,
  // ): Promise<SignedPutObject> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   const key = this.createKey(
  //     putObjectDto.filename,
  //     putObjectDto.folder,
  //     putObjectDto.newFilename,
  //   );

  //   const keyZip = key + '.zip';

  //   try {
  //     const url = await s3Client.getSignedUrlPromise('putObject', {
  //       Bucket: awsS3Bucket,
  //       Key: keyZip,
  //       Expires: this.ONE_MINUTE_IN_SECONDS,
  //       ContentType: putObjectDto.mimetype,
  //       Metadata: putObjectDto.metadata,
  //     });

  //     let base64Image = '';
  //     if (putObjectDto.file.includes(';base64,')) {
  //       base64Image = putObjectDto.file.split(';base64,').pop();
  //     } else {
  //       base64Image = putObjectDto.file;
  //     }

  //     const fileBuffer = Buffer.from(base64Image, 'base64');

  //     await this.httpService.axiosRef.put(url, fileBuffer, {
  //       headers: {
  //         'Content-Type': putObjectDto.mimetype,
  //       },
  //     });

  //     return { url, key: keyZip };
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao assinar o upload do arquivo');
  //     throw new GetSignedPutObjectException();
  //   }
  // }

  // async getListObjectsV2(
  //   prefix: string,
  //   continuationToken?: string,
  // ): Promise<any> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   try {
  //     const listObjects = await s3Client
  //       .listObjectsV2({
  //         Bucket: awsS3Bucket,
  //         Prefix: prefix,
  //         ContinuationToken: continuationToken,
  //       })
  //       .promise();

  //     return listObjects;
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao listar os objetos');
  //     throw error;
  //   }
  // }

  // async uploadObject(fileKey: string, data: Readable): Promise<void> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   try {
  //     await s3Client
  //       .upload({ Bucket: awsS3Bucket, Key: fileKey, Body: data })
  //       .promise();
  //   } catch (error) {
  //     this.logger.error(
  //       error,
  //       'Erro ao assinar o upload do arquivo pela Fila do Zip',
  //     );
  //     throw new GetSignedPutObjectException();
  //   }
  // }

  // async deleteObject(
  //   key: string,
  //   userId: string,
  //   companyId: string,
  //   fileId: string,
  //   ip: string,
  // ): Promise<FileEntity> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   try {
  //     await s3Client
  //       .deleteObject({
  //         Bucket: awsS3Bucket,
  //         Key: key,
  //       })
  //       .promise();

  //     return await this.repository.delete(key, userId, companyId, fileId, ip);
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao deletar o arquivo');
  //     throw new DeleteObjectException();
  //   }
  // }

  // async deleteObjectFromQueue(
  //   key: string,
  //   userId: string,
  //   userName: string,
  //   companyId: string,
  //   fileId: string,
  //   ip: string,
  // ): Promise<FileEntity> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   try {
  //     await s3Client
  //       .deleteObject({
  //         Bucket: awsS3Bucket,
  //         Key: key,
  //       })
  //       .promise();

  //     return await this.repository.deleteFileFromQueue(
  //       key,
  //       userId,
  //       userName,
  //       fileId,
  //       ip,
  //     );
  //   } catch (e) {
  //     this.logger.error('Erro ao deletar o arquivo', e);
  //     throw new DeleteObjectException();
  //   }
  // }

  // async deleteS3Object(key: string): Promise<void> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   try {
  //     await s3Client
  //       .deleteObject({
  //         Bucket: awsS3Bucket,
  //         Key: key,
  //       })
  //       .promise();

  //     return;
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao deletar o arquivo');
  //     throw new DeleteObjectException();
  //   }
  // }

  // async updateObjectMetadata(
  //   updateObjectMetadataDto: UpdateObjectMetadataDto,
  // ): Promise<void> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   const { key, metadata } = updateObjectMetadataDto;

  //   try {
  //     const objectHead = await s3Client
  //       .headObject({ Bucket: awsS3Bucket, Key: key })
  //       .promise();

  //     await s3Client
  //       .copyObject({
  //         Bucket: awsS3Bucket,
  //         CopySource: `${awsS3Bucket}/${key}`,
  //         Key: key,
  //         MetadataDirective: 'REPLACE',
  //         Metadata: { ...objectHead.Metadata, ...metadata },
  //         ContentType: objectHead.ContentType,
  //       })
  //       .promise();
  //   } catch (error) {
  //     this.logger.error(error, 'Erro ao atualizar o metadata do arquivo');
  //     throw new UpdateObjectMetadataException();
  //   }
  // }

  // async getObject(
  //   res: Response,
  //   next: NextFunction,
  //   key: string,
  //   userId: string,
  //   companyId: string,
  // ) {
  //   if (!userId || !companyId || !key) {
  //     throw new BadRequestException('Sem permissão para acessar o documento');
  //   }

  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new NotFoundError('Usuário não encontrado.');
  //   }

  //   const file = await this.prisma.file.findFirst({
  //     where: {
  //       url: key,
  //     },
  //   });

  //   if (!file) {
  //     throw new NotFoundError('Arquivo não encontrado.');
  //   }

  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   const getObjectHead = await s3Client
  //     .headObject({ Bucket: awsS3Bucket, Key: key })
  //     .promise();

  //   this.setHeaders(res, getObjectHead);

  //   const getObjectReadStream = s3Client
  //     .getObject({
  //       Bucket: awsS3Bucket,
  //       Key: key,
  //     })
  //     .createReadStream();

  //   getObjectReadStream.on('error', () => {
  //     next(new NotFoundException());
  //   });

  //   return new StreamableFile(getObjectReadStream);
  // }

  // async isPublic(key: string): Promise<boolean> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   const getObjectHead = await s3Client
  //     .headObject({ Bucket: awsS3Bucket, Key: key })
  //     .promise();

  //   return (
  //     getObjectHead &&
  //     getObjectHead.Metadata &&
  //     getObjectHead.Metadata.public === 'true'
  //   );
  // }

  // async getFileReadStream(key: string): Promise<Readable> {
  //   const s3Client = this.getS3Client();
  //   const awsS3Bucket = this.getS3Bucket();

  //   return await s3Client
  //     .getObject({
  //       Bucket: awsS3Bucket,
  //       Key: key,
  //     })
  //     .createReadStream();
  // }

  // getS3Client(): S3 {
  //   const awsRegion = this.configService.get<string>('AWS_S3_STORAGE_REGION'); // AWS_REGION
  //   const awsAccessKeyId = this.configService.get<string>(
  //     'AWS_S3_STORAGE_ACCESS_KEY_ID',
  //   ); // AWS_ACCESS_KEY_ID
  //   const awsSecretAccessKey = this.configService.get<string>(
  //     'AWS_S3_STORAGE_SECRET_ACCESS_KEY',
  //   ); // AWS_SECRET_ACCESS_KEY
  //   const awsS3Endpoint = this.configService.get<string | undefined>(
  //     'AWS_S3_STORAGE_ENDPOINT',
  //   );

  //   return new S3({
  //     signatureVersion: 'v4',
  //     region: awsRegion,
  //     accessKeyId: awsAccessKeyId,
  //     secretAccessKey: awsSecretAccessKey,
  //     endpoint: awsS3Endpoint,
  //     s3ForcePathStyle: !!awsS3Endpoint,
  //   });
  // }

  // getS3Bucket(): string {
  //   return this.configService.get<string>('AWS_S3_STORAGE_BUCKET_NAME');
  // }

  // protected createKey(
  //   filename: string,
  //   folder?: string,
  //   newFilename?: string,
  // ): string {
  //   // const extension = path.posix.extname(filename);

  //   const hasNewFilename = !!newFilename;

  //   const randomName = nanoid(hasNewFilename ? 15 : 30).toLowerCase();

  //   let finalFilename = `${randomName}`;

  //   if (hasNewFilename) {
  //     finalFilename = `${randomName}_${removeSpecialCharsAndAccents(
  //       newFilename,
  //     )}`;
  //   }

  //   console.log(
  //     path.posix.join(
  //       folder ? path.posix.normalize(folder) : '',
  //       finalFilename,
  //     ),
  //   );

  //   return path.posix.join(
  //     folder ? path.posix.normalize(folder) : '',
  //     finalFilename,
  //   );
  // }

  // protected setHeaders(res: Response, getObjectHead: S3.HeadObjectOutput) {
  //   res.set('Content-Type', getObjectHead.ContentType);
  //   res.set('Content-Length', String(getObjectHead.ContentLength));
  //   res.set('ETag', getObjectHead.ETag);
  //   res.set('Last-Modified', getObjectHead.LastModified.toISOString());
  //   res.set('Accept-Ranges', getObjectHead.AcceptRanges);
  // }

  // // public file

  // async uploadPublicFile(
  //   uploadPublicFileDto: Express.Multer.File,
  //   userId: string,
  //   folderName: string,
  //   companyId: string,
  //   ip: string,
  // ) {
  //   return await this.repository.uploadPublicFile(
  //     uploadPublicFileDto,
  //     userId,
  //     folderName,
  //     companyId,
  //     ip,
  //   );
  // }

  // async uploadPublicFileApp(
  //   uploadPublicFileAppDto: UploadPublicFileAppDto,
  //   userId: string,
  //   companyId: string,
  //   ip: string,
  // ) {
  //   return await this.repository.uploadPublicFileApp(
  //     uploadPublicFileAppDto,
  //     userId,
  //     companyId,
  //     ip,
  //   );
  // }

  // // repository

  // create(
  //   createFileDto: CreateFileDto,
  //   userId: string,
  //   companyId: string,
  //   ip: string,
  //   isTheme?: string,
  // ) {
  //   return this.repository.create(
  //     createFileDto,
  //     userId,
  //     companyId,
  //     ip,
  //     isTheme,
  //   );
  // }

  async findAll() {
    return await this.repository.findAll();
  }

  // async uploadFiles(
  //   files: Express.Multer.File[],
  //   userId: string,
  //   folderName: string,
  //   folderId: string,
  //   companyId: string,
  //   ip: string,
  // ) {
  //   try {
  //     // console.log({ files });
  //     // console.log({ userId });
  //     // console.log({ folderName });
  //     // console.log({ companyId });
  //     // console.log({ ip });

  //     let folder;

  //     if (folderName !== 'null' && folderId === 'null') {
  //       // console.log(`folderName !== 'null'`, folderName);
  //       // const allFolders = await this.prisma.

  //       folder = await this.prisma.folder.create({
  //         data: {
  //           name: folderName,
  //           owner_id: userId,
  //           is_main: true,
  //           company_id: companyId,
  //           path: folderName,
  //         },
  //       });
  //     }

  //     let childrens = [];
  //     let childrens_ids = [];

  //     if (folderId !== 'null' && folderName === 'null') {
  //       // console.log(`folderId !== 'null'`, folderId);
  //       // const allFolders = await this.prisma.

  //       folder = await this.prisma.folder.findUnique({
  //         where: {
  //           id: folderId,
  //         },
  //       });

  //       // if (folder.childrens.length > 0) {
  //       //   childrens = [...folder.childrens];
  //       //   childrens_ids = folder.childrens.map(c => c.id);
  //       // }
  //     }

  //     if (folderId !== 'null' && folderName !== 'null') {
  //       // console.log(`folderId !== 'null'`, folderId);

  //       folder = await this.prisma.folder.findUnique({
  //         where: {
  //           id: folderId,
  //         },
  //       });

  //       const newFolder = await this.prisma.folder.create({
  //         data: {
  //           name: folderName,
  //           owner_id: userId,
  //           is_main: false,
  //           company_id: companyId,
  //           path: `${folder.name}/${folderName}`,
  //         },
  //       });

  //       await this.prisma.folder.update({
  //         where: { id: folderId },
  //         data: {
  //           childrens: [...folder.childrens, { ...newFolder }],
  //           childrens_ids: [...folder.childrens_ids, newFolder.id],
  //         },
  //       });

  //       folder = newFolder;

  //       // if (folder.childrens.length > 0) {
  //       //   childrens = [...folder.childrens];
  //       //   childrens_ids = folder.childrens.map(c => c.id);
  //       // }
  //     }

  //     // console.log({ folder });

  //     const s3Client = this.getS3Client();
  //     const awsS3Bucket = this.getS3Bucket();

  //     for (const file of files) {
  //       const isPdfFile = file.mimetype === 'application/pdf';

  //       let fileBuffer = file?.buffer;
  //       // console.log('fileBuffer', fileBuffer);

  //       const key = this.createKey(file?.originalname, undefined, undefined);

  //       const keyPdf = key + '.pdf';

  //       const url = await s3Client.getSignedUrlPromise('putObject', {
  //         Bucket: awsS3Bucket,
  //         Key: keyPdf,
  //         Expires: this.ONE_MINUTE_IN_SECONDS,
  //         ContentType: file.mimetype,
  //         Metadata: undefined,
  //       });

  //       if (!isPdfFile) {
  //         const convertedFile = await this.convertToPDF(
  //           fileBuffer,
  //           file.originalname,
  //         );

  //         // console.log('Convertido', convertedFile);

  //         fileBuffer = Buffer.from(convertedFile, 'base64');
  //       }

  //       // const s3Object = await this.signedPutObject({
  //       //   file: convertedFile,
  //       //   filename: file.originalname,
  //       //   mimetype: file.mimetype,
  //       //   newFilename: undefined,
  //       //   folder: undefined,
  //       //   metadata: undefined,
  //       // });

  //       await this.httpService.axiosRef.put(url, fileBuffer, {
  //         headers: {
  //           'Content-Type': 'application/pdf',
  //         },
  //       });

  //       // console.log('folder.id', folder.id);
  //       const isMain =
  //         folderName !== 'null' || folderId !== 'null' ? false : true;
  //       // console.log('isMain', isMain);

  //       // console.log('url', s3Object.url);
  //       // console.log('key', s3Object.key);

  //       const fileName = Buffer.from(file.originalname, 'binary').toString(
  //         'utf8',
  //       );
  //       // console.log('fileNName', fileName);

  //       const data = {
  //         original_name: fileName,
  //         mimetype: 'application/pdf',
  //         size: file.size,
  //         key: keyPdf,
  //         url: keyPdf,
  //         is_downloaded: true,
  //         is_main: isMain,
  //         is_public: true,
  //         owner_id: userId,
  //         company_id: companyId,
  //         folder_id: folder.id,
  //       };

  //       const fileCreated = await this.repository.create(
  //         data,
  //         userId,
  //         companyId,
  //         ip,
  //       );
  //       // const fileCreated = await this.repository.uploadFiles(
  //       //   file,
  //       //   folder.id,
  //       //   userId,
  //       //   s3Object.key,
  //       //   companyId,
  //       // );

  //       childrens = [...childrens, { ...fileCreated }];
  //       childrens_ids = [...childrens_ids, fileCreated.id];
  //     }

  //     if (folder.id !== null && folderName !== 'null') {
  //       const folderUpdated = await this.prisma.folder.findUnique({
  //         where: { id: folder.id },
  //       });

  //       return { data: { ...folderUpdated }, type: 'folder' };
  //     } else {
  //       return { data: childrens, type: 'file' };
  //     }
  //   } catch (error) {
  //     this.logger.error(error, 'Erro upload files');
  //   }
  // }

  async findById(id: string, userId: string): Promise<FileEntity> {
    const file = await this.repository.findById(id, userId);

    if (!file) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    return file;
  }

  // async scriptAdjustAllKeysOnFiles(userId: string, companyId: string) {
  //   return this.repository.scriptAdjustAllKeysOnFiles(userId, companyId);
  // }

  // async scriptAdjustAllKeysOnFiles(userId: string, companyId: string) {
  //   const allFiles = await this.prisma.file.findMany({
  //     where: {
  //       company_id: companyId,
  //     },
  //   });

  //   console.log('allFiles count', allFiles.length);

  //   function temEspaco(str) {
  //     return /\s/.test(str);
  //   }

  //   let countFilesWithSpace = 0;

  //   for (const fileTest of allFiles) {
  //     if (temEspaco(fileTest.key)) {
  //       countFilesWithSpace += 1;
  //     }
  //   }

  //   console.log('countFilesWithSpace', countFilesWithSpace);

  //   let fiveFilesInTotal = [];

  //   for (const arquive of allFiles) {
  //     if (temEspaco(arquive.key)) {
  //       console.log(`5) Essa key tem espaço ${arquive.key}`);

  //       if (fiveFilesInTotal.length < 5) {
  //         fiveFilesInTotal = [...fiveFilesInTotal, arquive];
  //       }
  //     } else {
  //       console.log(`5) Essa key não tem espaço ${arquive.key}`);
  //     }
  //   }

  //   for (const file of fiveFilesInTotal) {
  //     if (temEspaco(file.key)) {
  //       console.log(`Essa key tem espaço ${file.key}`);

  //       await this.prisma.$transaction(async prisma => {
  //         const s3Client = this.getS3Client();
  //         const awsS3Bucket = this.getS3Bucket();

  //         const oldKey = file.key;

  //         const newKey = this.createKey(
  //           file.original_name,
  //           undefined,
  //           undefined,
  //         );

  //         // Copy the object to the new key
  //         await s3Client
  //           .copyObject({
  //             Bucket: awsS3Bucket,
  //             CopySource: `${awsS3Bucket}/${oldKey}`,
  //             Key: newKey,
  //           })
  //           .promise()
  //           .then(async () => {
  //             // The object was copied successfully
  //             console.log(
  //               `O objeto de key ${oldKey} foi copiado com sucesso, para a key ${newKey}`,
  //             );

  //             await prisma.file
  //               .update({
  //                 where: { id: file.id },
  //                 data: {
  //                   key: newKey,
  //                   url: newKey,
  //                 },
  //               })
  //               .then(() => {
  //                 console.log(
  //                   `O objeto de key ${oldKey} foi atualizado com sucesso, para a key ${newKey}`,
  //                 );
  //               })
  //               .catch(error => {
  //                 // There was an error during the operation
  //                 console.error(
  //                   error,
  //                   `Erro ao editar o arquivo de ${file.id}`,
  //                 );
  //               });
  //             // Delete the object from the old key
  //             //   s3Client
  //             //     .deleteObject({
  //             //       Bucket: awsS3Bucket,
  //             //       Key: oldKey,
  //             //     })
  //             //     .promise()
  //             //     .then(() => {
  //             //       // The object was deleted successfully
  //             //       console.log(
  //             //         `O arquivo de key ${oldKey} foi deletado com sucesso!`,
  //             //       );
  //             //     })
  //             //     .catch(error => {
  //             //       // There was an error during the operation
  //             //       console.error('Erro ao deletar', error);
  //             //     });
  //           })
  //           .catch(error => {
  //             // There was an error during the operation
  //             console.error(error, 'Erro ao copiar o arquivo');
  //           });
  //       });
  //     } else {
  //       console.log(`Essa key não tem espaço ${file.key}`);
  //     }
  //   }

  //   return 'success';
  // }

  async update(
    id: string,
    updateFileDto: UpdateFileDto,
    userId: string,
    ip: string,
  ) {
    return this.repository.update(id, updateFileDto, userId, ip);
  }

  async remove(id: string, userId: string, ip?: string): Promise<FileEntity> {
    // const s3Client = this.getS3Client();
    // const awsS3Bucket = this.getS3Bucket();

    const fileExists = await this.repository.findById(id, userId);

    if (!fileExists) {
      throw new NotFoundError('Arquivo não encontrado.');
    }

    await this.repository.remove(id, userId, ip);

    // await s3Client
    //   .deleteObject({
    //     Bucket: awsS3Bucket,
    //     Key: fileExists.key,
    //   })
    //   .promise();

    return fileExists;
  }

  // async getNumberPagesPdfFile(fileKey: string) {
  //   const s3File = await this.getFileReadStream(fileKey).then(r => r);

  //   // console.log('s3File => ', !!s3File);

  //   await writeFile(fileKey, s3File);
  //   const uint8Array = await readFile(fileKey);

  //   // console.log({ uint8Array });

  //   const pdfFile = await PDFDocument.load(uint8Array);

  //   const pagesNumber = pdfFile.getPageCount();

  //   await unlink(fileKey);

  //   // console.log({ pagesNumber });
  //   return pagesNumber;
  // }

  // async getFileContentById(id: string, userId: string) {
  //   const file = await this.prisma.file.findUnique({
  //     where: { id },
  //   });

  //   if (!file) {
  //     throw new NotFoundError('Arquivo não encontrado.');
  //   }

  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new NotFoundError('Usuário não encontrado.');
  //   }

  //   const s3File = await this.getFileReadStream(file.url).then(r => r);

  //   await writeFile(`${__dirname}/${file.url}`, s3File);
  //   const uint8Array = await readFile(`${__dirname}/${file.url}`);

  //   await unlink(`${__dirname}/${file.url}`);

  //   const pdfDoc = await PDFDocument.create();
  //   const pdfFile = await PDFDocument.load(uint8Array);

  //   const pagesNumber = pdfFile.getPageCount();

  //   for (let k = 0; k <= pagesNumber - 1; k++) {
  //     const [existingPage] = await pdfDoc.copyPages(pdfFile, [k]);

  //     const { width, height } = existingPage.getSize();

  //     existingPage.drawText(`${user.doc}`, {
  //       x: width / 2 - 100,
  //       y: Math.ceil(height * 0.08),
  //       size: 30,
  //       color: rgb(0.5, 0.5, 0.5),
  //       opacity: 0.2,
  //       rotate: degrees(30),
  //     });

  //     existingPage.drawText(
  //       `${dayjs(new Date()).format('DD/MM/YYYY[ ]HH:mm')}`,
  //       {
  //         x: width / 2 - 100,
  //         y: Math.ceil(height * 0.08) - 50,
  //         size: 30,
  //         color: rgb(0.5, 0.5, 0.5),
  //         opacity: 0.2,
  //         rotate: degrees(30),
  //       },
  //     );

  //     existingPage.drawText(`${user.doc}`, {
  //       x: width / 2 - 100,
  //       y: height / 2 - 50,
  //       size: 30,
  //       color: rgb(0.5, 0.5, 0.5),
  //       opacity: 0.2,
  //       rotate: degrees(30),
  //     });

  //     existingPage.drawText(
  //       `${dayjs(new Date()).format('DD/MM/YYYY[ ]HH:mm')}`,
  //       {
  //         x: width / 2 - 100,
  //         y: height / 2 - 100,
  //         size: 30,
  //         color: rgb(0.5, 0.5, 0.5),
  //         opacity: 0.2,
  //         rotate: degrees(30),
  //       },
  //     );

  //     existingPage.drawText(`${user.doc}`, {
  //       x: width / 2 - 100,
  //       y: Math.ceil(height * 0.85),
  //       size: 30,
  //       color: rgb(0.5, 0.5, 0.5),
  //       opacity: 0.2,
  //       rotate: degrees(30),
  //     });

  //     existingPage.drawText(
  //       `${dayjs(new Date()).format('DD/MM/YYYY[ ]HH:mm')}`,
  //       {
  //         x: width / 2 - 100,
  //         y: Math.ceil(height * 0.85) - 50,
  //         size: 30,
  //         color: rgb(0.5, 0.5, 0.5),
  //         opacity: 0.2,
  //         rotate: degrees(30),
  //       },
  //     );

  //     pdfDoc.addPage(existingPage);
  //   }

  //   const pdfBase64 = await pdfDoc.saveAsBase64();

  //   return pdfBase64;
  // }
}
