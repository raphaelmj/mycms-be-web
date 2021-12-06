import { Injectable } from '@nestjs/common';
import { PageData } from '../../../interfaces/web/page-data.interface';
import { DynamicView } from '../../../enums/dynamic-view.enum';
import { Article } from '../../../entities/Article';
import { Variant } from '../../../entities/Variant';
import { Department } from '../../../entities/Department';
import { Investition } from '../../../entities/Investition';
import { PageViewType } from '../../../enums/page-view-type.enum';

export interface MetaData {
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
}

@Injectable()
export class MetaTagsService {
  prepareMetaData(pageData: PageData): MetaData {
    let metaData: MetaData = {
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
    };

    if (pageData.data.isPage) {
      const { metaTitle, metaKeywords, metaDescription } = pageData.page;
      metaData = { metaTitle, metaKeywords, metaDescription };
      if (
        (!metaData.metaTitle || metaData.metaTitle == '') &&
        pageData.data.view !== PageViewType.main
      ) {
        metaData.metaTitle = pageData.page.title;
      }
    } else {
      metaData = this.findMetaDataOnDynamicPages(pageData, metaData);
    }

    return metaData;
  }

  findMetaDataOnDynamicPages(pageData: PageData, metaData: MetaData) {
    switch (pageData.data.view) {
      case DynamicView.article:
        metaData = this.getMetaData(
          pageData.data.dynamicData.article.articleData,
        );
        if (metaData.metaTitle == '') {
          metaData.metaTitle =
            pageData.data.dynamicData.article.articleData.title;
        }
        break;
      case DynamicView.notice:
        metaData.metaTitle = pageData.data.dynamicData.notice.noticeData.name;
        break;
      case DynamicView.variant:
        metaData = this.getMetaData(
          pageData.data.dynamicData.invests.currentVariant,
        );
        if (metaData.metaTitle == '') {
          metaData.metaTitle =
            pageData.parentPage.title +
            ' - ' +
            pageData.data.dynamicData.invests.currentVariant.name;
        }
        break;
      case DynamicView.department:
        metaData = this.getMetaData(
          pageData.data.dynamicData.departmentData.data.department,
        );
        if (metaData.metaTitle == '') {
          metaData.metaTitle =
            pageData.data.dynamicData.departmentData.data.department.name;
        }
        break;
      case DynamicView.invest:
        metaData = this.getMetaData(
          pageData.data.dynamicData.invest.investData,
        );
        let address = '';
        if (pageData.data.dynamicData.invest.investData.address) {
          address = pageData.data.dynamicData.invest.investData.address;
        }
        if (metaData.metaTitle == '') {
          metaData.metaTitle =
            pageData.data.dynamicData.invest.investData.name +
            ' ' +
            pageData.data.dynamicData.invest.investData.city +
            ' ' +
            address.replace(/(<([^>]+)>)/gi, ' ');
        }
        break;
    }
    return metaData;
  }

  getMetaData(data: Article | Variant | Department | Investition): MetaData {
    const { metaTitle, metaKeywords, metaDescription } = data;
    return { metaTitle, metaKeywords, metaDescription };
  }
}
