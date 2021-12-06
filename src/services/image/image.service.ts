import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as Jimp from 'jimp';
import * as config from 'config';
import { ISize } from 'image-size/dist/types/interface';
import { CatalogService } from '../catalog/catalog.service';

const pathsConfig = config.get('paths');

@Injectable()
export class ImageService {
  uploadsFolder = pathsConfig.uploadsFolder;

  constructor(private readonly catalogService: CatalogService) {}

  async makeThumbnail(
    imagePath: string,
    imageSize: ISize,
    folder: string,
    thumbName: string,
    thumbWidth = 400,
    quality = 60,
  ): Promise<string> {
    const thumbFolder = folder + '/thumbs';
    const imageRelativePath = join(process.cwd(), 'static/' + imagePath);
    await this.catalogService.makeSubFolderIfNotExits(thumbFolder);
    const thumbPathLink = this.uploadsFolder + '/' + thumbFolder;
    const bufferImage: Buffer = fs.readFileSync(imageRelativePath);
    const thumbSize = this.proportionsReduce(imageSize, thumbWidth);
    const source = await Jimp.read(bufferImage);
    await source
      .resize(thumbSize.width, thumbSize.height)
      .quality(quality)
      .write(join(process.cwd(), '/static/' + thumbPathLink + '/' + thumbName));
    return '/' + thumbPathLink + '/' + thumbName;
  }

  proportionsReduce(imageSize: ISize, width: number): ISize {
    const height = (width * imageSize.height) / imageSize.width;
    return {
      width,
      height,
    };
  }
}
