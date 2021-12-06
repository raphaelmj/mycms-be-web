import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as config from 'config';

const pathsConfig = config.get('paths');

@Injectable()
export class CatalogService {
  uploadsFolder = pathsConfig.uploadsFolder;
  staticPath: string = process.cwd() + '/static';

  async makeSubFolderIfNotExits(subFolder: string, uploadFolder?: string) {
    const folder: string = !uploadFolder ? this.uploadsFolder : uploadFolder;
    if (!fs.existsSync(this.staticPath + '/' + folder + '/' + subFolder)) {
      fs.mkdirSync(this.staticPath + '/' + folder + '/' + subFolder);
    }
  }

  async makeDateFolderIfNotExits(subFolder: string, folder: string) {
    if (
      !fs.existsSync(
        this.staticPath +
          '/' +
          this.uploadsFolder +
          '/' +
          subFolder +
          '/' +
          folder,
      )
    ) {
      fs.mkdirSync(
        this.staticPath +
          '/' +
          this.uploadsFolder +
          '/' +
          subFolder +
          '/' +
          folder,
      );
    }
  }

  async makeUploadsFolderIfNotExits() {
    if (!fs.existsSync(this.staticPath + '/' + this.uploadsFolder)) {
      fs.mkdirSync(this.staticPath + '/' + this.uploadsFolder);
    }
  }
}
