import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { UrlParserService } from '../web/web-services/url-parser/url-parser.service';
import {
  MetaData,
  MetaTagsService,
} from '../web/web-services/meta-tags/meta-tags.service';
import { PageData } from '../interfaces/web/page-data.interface';
import * as fs from 'fs';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  nparkSpecial?: boolean = true;

  constructor(
    private urlParserService: UrlParserService,
    private metaTagsService: MetaTagsService,
  ) {}

  async catch(_exception: NotFoundException, host: ArgumentsHost) {
    const assetsConfig: {
      jsFileName: string;
      cssFileName: string;
    } = this.getJsonConfig();
    const pageData: PageData = await this.urlParserService.init({});
    const metaData: MetaData = this.metaTagsService.prepareMetaData(pageData);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(_exception.getStatus()).render('page/error404', {
      ...pageData,
      ...{ pageColor: { alias: 'blue', rgb: '00A0DF' } },
      ...metaData,
      ...{ isCookie: true },
      ...{ nparkSpecial: this.nparkSpecial },
      ...{ assetsConfig },
    });
  }

  getJsonConfig(): { jsFileName: string; cssFileName: string } {
    const buffer: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/app.json',
    );
    const json = buffer.toString();
    return JSON.parse(json);
  }
}
