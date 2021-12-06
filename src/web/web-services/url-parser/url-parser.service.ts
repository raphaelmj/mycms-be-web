import { Injectable } from '@nestjs/common';
import { ParamsList } from '../../../interfaces/web/params-list.interface';
import { PageDataFinderService } from '../page-data-finder/page-data-finder.service';
import { PageData } from '../../../interfaces/web/page-data.interface';
import { PositionService } from '../../../services/position/position.service';
import { StaticMenus } from '../../../interfaces/web/static-menus.interface';
import { PageQuery } from '../../../interfaces/web/page-query.interface';
import { Page } from '../../../entities/Page';
import { ContextMenuElement } from '../../../interfaces/web/context-menu-element.interface';
import { NavigationService } from '../navigation/navigation.service';
import { OfficeWebService } from '../office-web/office-web.service';

@Injectable()
export class UrlParserService {
  constructor(
    private pageDataFinderService: PageDataFinderService,
    private positionsService: PositionService,
    private navigationService: NavigationService,
    private officeWebService: OfficeWebService,
  ) {}

  async init(paramsList: ParamsList, query?: PageQuery): Promise<PageData> {
    const path: string = Object.keys(paramsList)
      .filter((key) => paramsList[key])
      .map((key) => paramsList[key])
      .join('/');

    let dataAndPage = await this.pageDataFinderService.findPage(
      `/${path}`,
      query,
    );

    if (!dataAndPage.page) {
      dataAndPage = await this.pageDataFinderService.dynamicUrlParse(
        path,
        paramsList,
      );
    }

    const ids: number[] =
      <number[]>(<unknown>dataAndPage?.page?.leftPages) ||
      <number[]>(<unknown>dataAndPage?.parentPage?.leftPages) ||
      [];

    const staticMenus: StaticMenus = await this.defaultPageData();
    const leftPages: Page[] = await this.pageDataFinderService.getLeftPages(
      ids,
    );
    const {
      contextMenuTop,
      contextMenuBottom,
    } = await this.pageDataFinderService.getContextMenus(dataAndPage);

    dataAndPage.mainOffice = await this.officeWebService.getMainOffice();

    return {
      ...dataAndPage,
      ...{ staticMenus, leftPages, contextMenuTop, contextMenuBottom },
    };
  }

  async defaultPageData(): Promise<StaticMenus> {
    return await this.positionsService.getPostionsData();
  }

  async createBreadcrumbsByData(pageData: PageData, params: ParamsList) {
    const { pageExistsParams } = await PageDataFinderService.paramsParse(
      params,
    );
    return await this.navigationService.createBreadcrumbs(
      pageData,
      pageExistsParams,
    );
  }
}
