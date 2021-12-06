import {
  Controller,
  Next,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CatalogService } from '../../services/catalog/catalog.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';

const uploadFolder = 'attachments';

@Controller('api/upload-files/')
export class UploadFilesController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post(':type(one|many)/:folder')
  async createDirIfNotExists(
    @Req() req,
    @Res() res,
    @Next() next,
    @Param() params,
  ) {
    await this.catalogService.makeSubFolderIfNotExits(
      <string>params.folder,
      uploadFolder,
    );
    next();
  }

  @Post('one/:folder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(
            null,
            'static/' + uploadFolder + '/' + req.params.folder + '/',
          );
        },
        filename: (req, file, callback) => {
          console.log(file);
          const randomName = moment().format('YYYY-MM-DD-HH-mm-ss-SSS');
          const fileName = `${randomName}-${file.originalname}`;
          req['filePath'] = `/${uploadFolder}/${req.params.folder}/${fileName}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        return cb(null, true);
      },
    }),
  )
  async uploadFile(
    @Req() req,
    @Res() res,
    @UploadedFiles() files,
    @Next() next,
  ) {
    return res.json(req.filePath);
  }

  @Post('many/:folder')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      storage: diskStorage({
        destination: (req) => {
          return 'static/' + uploadFolder + '/' + req.params.folder + '/';
        },
        filename(
          req,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const randomName = moment().format('YYYY-MM-DD-HH-mm-ss-SSS');
          const fileName = `${randomName}-${file.originalname}`;
          if (!req['filePaths']) {
            req['filePaths'] = [];
          }
          req['filePaths'].push(
            `/${uploadFolder}/${req.params.folder}/${fileName}`,
          );
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFiles(
    @Req() req,
    @Res() res,
    @UploadedFiles() files,
    @Next() next,
  ) {
    return res.json(req.filePaths);
  }
}
