import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UrlParserService } from '../web-services/url-parser/url-parser.service';
import { ParamsList } from '../../interfaces/web/params-list.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../entities/Page';
import { Repository } from 'typeorm';
import { PageData } from '../../interfaces/web/page-data.interface';
import { PageQuery } from '../../interfaces/web/page-query.interface';
import * as config from 'config';
import { BreadcrumbsService } from '../web-services/breadcrumbs/breadcrumbs.service';
import { AllMapsData, MapsService } from '../web-services/maps/maps.service';
import {
  MetaData,
  MetaTagsService,
} from '../web-services/meta-tags/meta-tags.service';
import { PopupsWebService } from '../web-services/popups-web/popups-web.service';
import { Popup } from '../../entities/Popup';
import * as fs from 'fs';

const paginationConfig: { limit: number } = config.get('pagination');

@Controller('')
export class PageController {
  nparkSpecial?: boolean = true;
  constructor(
    private urlParserService: UrlParserService,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    private breadcrumbsService: BreadcrumbsService,
    private mapsService: MapsService,
    private metaTagsService: MetaTagsService,
    private popupsWebService: PopupsWebService,
  ) {}

  @Get('/')
  async home(@Req() req, @Res() res, @Param() params, @Headers() headers) {
    const assetsConfig: {
      jsFileName: string;
      cssFileName: string;
    } = this.getJsonConfig();
    const pageData: PageData = await this.urlParserService.init({});
    pageData.paginationConfig = paginationConfig;
    const pages: Page[] = await this.pageRepository.find();
    const metaData: MetaData = this.metaTagsService.prepareMetaData(pageData);
    const popup: Popup | null = await this.popupsWebService.findPopup(pageData);
    // return res.json(pageData);
    return res.render('page/index', {
      ...{ pages },
      ...pageData,
      ...metaData,
      ...{ popup },
      ...{ isCookie: !!req.cookies.cookie_confirm },
      ...{ nparkSpecial: this.nparkSpecial },
      ...{ assetsConfig },
      ...{ fullUrl: this.getFullUrl(req) },
    });
  }

  @Get('/:a/:b?/:c?')
  async page(
    @Req() req,
    @Res() res,
    @Param() params: ParamsList,
    @Query() query?: PageQuery,
  ) {
    const assetsConfig: {
      jsFileName: string;
      cssFileName: string;
    } = this.getJsonConfig();
    const pageData: PageData = await this.urlParserService.init(params, query);
    pageData.paginationConfig = paginationConfig;
    const breadcrumbs = await this.breadcrumbsService.create(pageData);
    const allMapsData: AllMapsData = await this.mapsService.getMapsData();
    const metaData: MetaData = this.metaTagsService.prepareMetaData(pageData);
    const popup: Popup | null = await this.popupsWebService.findPopup(pageData);
    if (
      (pageData.data.view !== 'articles' &&
        pageData.data.view !== 'invests' &&
        pageData.data.view !== 'notices' &&
        pageData.data.view !== 'contact') ||
      !pageData.data.isPage
    ) {
      // return res.json({
      //   ...pageData,
      //   ...allMapsData,
      //   ...{breadcrumbs},
      //   ...metaData
      // ...{ popup },
      // });
    }
    // return res.json({
    //   ...pageData,
    //   ...allMapsData,
    //   ...{ breadcrumbs },
    //   ...metaData,
    //   ...{ popup },
    // });
    if (pageData.data.view === 'error404') {
      return res.status(404).render(`page/${pageData.data.view}`, {
        ...pageData,
        ...{ pageColor: { alias: 'blue', rgb: '00A0DF' } },
        ...metaData,
        ...{ isCookie: !!req.cookies.cookie_confirm },
        ...{ nparkSpecial: this.nparkSpecial },
        ...{ assetsConfig },
        ...{ fullUrl: this.getFullUrl(req) },
      });
    } else {
      return res.render(`page/${pageData.data.view}`, {
        ...pageData,
        ...allMapsData,
        ...{ breadcrumbs },
        ...metaData,
        ...{ popup },
        ...{ isCookie: !!req.cookies.cookie_confirm },
        ...{ nparkSpecial: this.nparkSpecial },
        ...{ assetsConfig },
        ...{ fullUrl: this.getFullUrl(req) },
      });
    }
  }

  getJsonConfig(): { jsFileName: string; cssFileName: string } {
    const buffer: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/app.json',
    );
    const json = buffer.toString();
    return JSON.parse(json);
  }

  getFullUrl(req): string {
    return this.getHostAndPort(req) + req.path;
  }

  getHostAndPort(req) {
    return (true ? 'https' : 'http') + '://' + req.headers.host;
  }
}
