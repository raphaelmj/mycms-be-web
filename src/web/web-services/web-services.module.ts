import { Module } from '@nestjs/common';
import { UrlParserService } from './url-parser/url-parser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesList } from '../../config/typeorm.config';
import { PageDataFinderService } from './page-data-finder/page-data-finder.service';
import { PositionService } from '../../services/position/position.service';
import { ArticleService } from '../../services/article/article.service';
import { ContactWebService } from './contact-web/contact-web.service';
import { InvestitionWebService } from './investition-web/investition-web.service';
import { DepartmentWebService } from './department-web/department-web.service';
import { VariantWebService } from './variant-web/variant-web.service';
import { NoticeWebService } from './notice-web/notice-web.service';
import { ArticleWebService } from './article-web/article-web.service';
import { OfficeWebService } from './office-web/office-web.service';
import { NavigationService } from './navigation/navigation.service';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { MapsService } from './maps/maps.service';
import { MetaTagsService } from './meta-tags/meta-tags.service';
import { PopupsWebService } from './popups-web/popups-web.service';

@Module({
  imports: [TypeOrmModule.forFeature(entitiesList)],
  providers: [
    UrlParserService,
    PageDataFinderService,
    PositionService,
    ArticleService,
    ContactWebService,
    InvestitionWebService,
    DepartmentWebService,
    VariantWebService,
    NoticeWebService,
    ArticleWebService,
    OfficeWebService,
    NavigationService,
    {
      provide: 'PageRelations',
      useValue: [
        'contact',
        'category',
        'article',
        'office',
        'variants',
        'department',
        'departments',
        'popups',
      ],
    },
    BreadcrumbsService,
    MapsService,
    MetaTagsService,
    PopupsWebService,
  ],
  exports: [
    UrlParserService,
    PositionService,
    ArticleService,
    ArticleService,
    ContactWebService,
    InvestitionWebService,
    DepartmentWebService,
    VariantWebService,
    NoticeWebService,
    ArticleWebService,
    OfficeWebService,
    NavigationService,
    BreadcrumbsService,
    MapsService,
    MetaTagsService,
    PopupsWebService,
  ],
})
export class WebServicesModule {}
