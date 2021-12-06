import { Injectable } from '@nestjs/common';
import { PageData } from '../../../interfaces/web/page-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../../entities/Page';
import { Repository } from 'typeorm';
import { PageViewType } from '../../../enums/page-view-type.enum';
import { DynamicView } from '../../../enums/dynamic-view.enum';
import { Article } from '../../../entities/Article';
import { Message } from '../../../entities/Message';
import { Department } from '../../../entities/Department';
import { DataViewPack } from '../../../interfaces/web/data-view-pack.interface';
import {
  Breadcrumb,
  Breadcrumbs,
} from '../../../interfaces/breadcrumbs.interface';

@Injectable()
export class BreadcrumbsService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async create(pageData: PageData): Promise<Breadcrumbs> {
    const homePage: Page = await this.pageRepository.findOne({
      where: { viewType: PageViewType.main },
    });
    const breadcrumbs: Breadcrumbs = [
      { title: homePage.title, path: homePage.path, asLink: true },
    ];
    if (pageData.data.isPage) {
      breadcrumbs.push({
        title: pageData?.page.title,
        path: pageData?.page.path,
        asLink: false,
      });
    } else {
      breadcrumbs.push({
        title: pageData?.parentPage?.title,
        path: pageData?.parentPage?.path,
        asLink: true,
      });
      const breadcrumbsElements: Breadcrumb[] = this.findDynamicElement(
        pageData.data,
      );
      breadcrumbsElements.forEach((breadcrumbsElement) => {
        breadcrumbs.push(breadcrumbsElement);
      });
    }
    return breadcrumbs;
  }

  findDynamicElement(data: DataViewPack) {
    const breadcrumbsElements: Breadcrumb[] = [];
    switch (data.view) {
      case DynamicView.variant:
        breadcrumbsElements.push({
          title: data.dynamicData.invests.currentVariant.name,
          path: data.dynamicData.invests.currentVariant.path,
          asLink: false,
        });
        break;
      case DynamicView.article:
        breadcrumbsElements.push({
          title: data.dynamicData.article.articleData.title,
          path: '',
          asLink: false,
        });
        break;
      case DynamicView.notice:
        breadcrumbsElements.push({
          title: data.dynamicData.notice.noticeData.name,
          path: '',
          asLink: false,
        });
        break;
      case DynamicView.department:
        breadcrumbsElements.push({
          title: data.dynamicData.departmentData.data.department.name,
          path: '',
          asLink: false,
        });
        break;
      case DynamicView.invest:
        breadcrumbsElements.push({
          title: data.dynamicData.invest?.parentVariant?.name,
          path: data.dynamicData.invest?.parentVariant?.path,
          asLink: true,
        });
        breadcrumbsElements.push({
          title: data.dynamicData.invest?.investData?.name,
          path: `${data.dynamicData.invest?.parentVariant?.path}/${data.dynamicData.invest.investData.alias}`,
          asLink: false,
        });
        break;
      default:
        break;
    }
    return breadcrumbsElements;
  }
}
