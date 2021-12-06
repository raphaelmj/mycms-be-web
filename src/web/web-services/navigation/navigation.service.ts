import { Injectable } from '@nestjs/common';
import { PageData } from '../../../interfaces/web/page-data.interface';

@Injectable()
export class NavigationService {
  async createBreadcrumbs(pageData: PageData, pageExistsParams: string[]) {
    if (pageData.data.isPage) {
      // console.log(pageExistsParams);
    } else {
      // console.log(pageExistsParams);
    }
  }
}
