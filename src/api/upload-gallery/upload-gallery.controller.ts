import { ImageService } from './../../services/image/image.service';
import {
  Controller,
  Next,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { extname } from 'path';
import * as sizeOf from 'image-size';
import { CatalogService } from 'src/services/catalog/catalog.service';
import * as config from 'config';
import { ISize } from 'image-size/dist/types/interface';

const pathsConfig = config.get('paths');
const folder = 'galleries';

@Controller('api/upload-gallery')
export class UploadGalleryController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly imageService: ImageService,
  ) {}

  @Post('')
  async createDirIfNotExists(@Req() req, @Res() res, @Next() next) {
    await this.catalogService.makeSubFolderIfNotExits(folder);
    next();
  }

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'static/' + pathsConfig.uploadsFolder + '/' + folder + '/',
        filename: (req, file, cb) => {
          const randomName = moment().format('YYYY-MM-DD-HH-mm-ss-SSS');
          req['thumbName'] = `thumb-${randomName}${extname(file.originalname)}`;
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
          return cb(null, true);
        }
        return cb(null, false);
      },
    }),
  )
  async uploadFile(@Req() req, @Res() res, @UploadedFile() file, @Next() next) {
    // return res.json(file)
    const imagePath: string =
      '/' + pathsConfig.uploadsFolder + '/' + folder + '/' + file.filename;
    const size: ISize = sizeOf.imageSize(
      'static/' +
        pathsConfig.uploadsFolder +
        '/' +
        folder +
        '/' +
        file.filename,
    );
    const thumb: string = await this.imageService.makeThumbnail(
      imagePath,
      size,
      folder,
      req.thumbName,
      500,
    );
    return res.json({
      src: imagePath,
      sizeString: size.width + 'x' + size.height,
      type: 'image',
      thumb,
    });
  }
}
