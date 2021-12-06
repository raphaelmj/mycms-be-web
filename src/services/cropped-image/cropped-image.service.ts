import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as moment from 'moment';
import * as config from 'config';
import * as sizeOf from 'image-size';
import { CatalogService } from '../catalog/catalog.service';
import { ISize } from 'image-size/dist/types/interface';
import { ImageGallery } from '../../interfaces/image-gallery.interface';
import { ImageOrientationType } from '../../types/image-orientation.type';

@Injectable()
export class CroppedImageService {
  constructor(private readonly catalogService: CatalogService) {}

  async makeCroppedImage(
    imageData,
    subFolder = 'img',
    imageSuffix = 'jpg',
    withSize = false,
  ): Promise<string | { path: string; sizeString: string } | null> {
    const regex = /^data:((\w+)\/(\w+));base64,(.*)$/;
    if (imageData != '' && regex.test(imageData)) {
      const folder = moment().format('YYYYMMDD');
      const imageName =
        'image-' + moment().format('HH-mm-ss-SSS') + '.' + imageSuffix;
      const imgSource = imageData.match(regex)[4];
      const imageUri =
        '/images/uploads/' + subFolder + '/' + folder + '/' + imageName;
      await this.catalogService.makeUploadsFolderIfNotExits();
      await this.catalogService.makeSubFolderIfNotExits(subFolder);
      await this.catalogService.makeDateFolderIfNotExits(subFolder, folder);
      await this.createImageFile(imageUri, imgSource);
      if (withSize) {
        const size: ISize = sizeOf.imageSize('static' + imageUri);
        return { path: imageUri, sizeString: size.width + 'x' + size.height };
      } else {
        return imageUri;
      }
    } else {
      return null;
    }
  }

  async makeCroppedImagePopup(
    imageData,
    subFolder = 'img',
    imageSuffix = 'jpg',
  ): Promise<{
    path: string;
    sizeString: string;
    orientation: ImageOrientationType;
  } | null> {
    const regex = /^data:((\w+)\/(\w+));base64,(.*)$/;
    if (imageData != '' && regex.test(imageData)) {
      const folder = moment().format('YYYYMMDD');
      const imageName =
        'image-' + moment().format('HH-mm-ss-SSS') + '.' + imageSuffix;
      const imgSource = imageData.match(regex)[4];
      const imageUri =
        '/images/uploads/' + subFolder + '/' + folder + '/' + imageName;
      await this.catalogService.makeUploadsFolderIfNotExits();
      await this.catalogService.makeSubFolderIfNotExits(subFolder);
      await this.catalogService.makeDateFolderIfNotExits(subFolder, folder);
      await this.createImageFile(imageUri, imgSource);
      const size: ISize = sizeOf.imageSize('static' + imageUri);
      const orientation: ImageOrientationType =
        size.height > size.width ? 'vertical' : 'horizontal';
      return {
        path: imageUri,
        sizeString: size.width + 'x' + size.height,
        orientation,
      };
    } else {
      return null;
    }
  }

  async makeCroppedImageGallery(
    imageData,
    subFolder = 'img',
    imageSuffix = 'jpg',
    withSize = false,
  ): Promise<string | ImageGallery | null> {
    const regex = /^data:((\w+)\/(\w+));base64,(.*)$/;
    if (imageData != '' && regex.test(imageData)) {
      const folder = moment().format('YYYYMMDD');
      const imageName =
        'image-' + moment().format('HH-mm-ss-SSS') + '.' + imageSuffix;
      const imgSource = imageData.match(regex)[4];
      const imageUri =
        '/images/uploads/' + subFolder + '/' + folder + '/' + imageName;
      await this.catalogService.makeUploadsFolderIfNotExits();
      await this.catalogService.makeSubFolderIfNotExits(subFolder);
      await this.catalogService.makeDateFolderIfNotExits(subFolder, folder);
      await this.createImageFile(imageUri, imgSource);
      if (withSize) {
        const size: ISize = sizeOf.imageSize('static' + imageUri);
        return { src: imageUri, sizeString: size.width + 'x' + size.height };
      } else {
        return imageUri;
      }
    } else {
      return null;
    }
  }

  async createImageFile(imageUri: string, imgSource: string) {
    return fs.writeFileSync(
      join(process.cwd(), 'static' + imageUri),
      imgSource,
      {
        encoding: 'base64',
      },
    );
  }
}
