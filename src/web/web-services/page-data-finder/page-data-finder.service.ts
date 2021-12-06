import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../../entities/Page';
import { Repository } from 'typeorm';
import { PageData } from '../../../interfaces/web/page-data.interface';
import { PageViewType } from '../../../enums/page-view-type.enum';
import {
  DataViewPack,
  DynamicData,
  InvestDynamicData,
} from '../../../interfaces/web/data-view-pack.interface';
import { PageQuery } from '../../../interfaces/web/page-query.interface';
import { ContactWebService } from '../contact-web/contact-web.service';
import { DepartmentWebService } from '../department-web/department-web.service';
import { VariantWebService } from '../variant-web/variant-web.service';
import { Variant } from '../../../entities/Variant';
import { NoticeWebService } from '../notice-web/notice-web.service';
import { Message } from '../../../entities/Message';
import { ParamsList } from '../../../interfaces/web/params-list.interface';
import { DynamicView } from '../../../enums/dynamic-view.enum';
import { InvestitionWebService } from '../investition-web/investition-web.service';
import { ArticleWebService } from '../article-web/article-web.service';
import { Article } from '../../../entities/Article';
import { map } from 'p-iteration';
import { Department } from '../../../entities/Department';
import { ContextMenus } from '../../../interfaces/web/context-menus.interface';
import { ContextMenuElement } from '../../../interfaces/web/context-menu-element.interface';
import { DepartmentType } from '../../../enums/department-type.enum';

@Injectable()
export class PageDataFinderService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    private articleWebServiceService: ArticleWebService,
    private contactWebService: ContactWebService,
    private departmentWebService: DepartmentWebService,
    private variantWebService: VariantWebService,
    private noticeWebService: NoticeWebService,
    private investitionWebService: InvestitionWebService,
    @Inject('PageRelations') private pageRelations: string[],
  ) {}

  async findPage(path: string, query?: PageQuery): Promise<PageData> {
    const page: Page = await this.pageRepository.findOne(
      { path },
      {
        relations: this.pageRelations,
      },
    );
    let data: DataViewPack;
    if (page) {
      data = await this.dataByPage(page, query);
    }
    const pageData: PageData = { ...{ page }, ...{ data } };
    return pageData;
  }

  async dataByPage(page: Page, query?: PageQuery): Promise<DataViewPack> {
    const data: DataViewPack = {
      view: 'error404',
      isPage: true,
    };
    switch (page.viewType) {
      case PageViewType.main:
        data.view = PageViewType.main;
        break;
      case PageViewType.article:
        data.view = PageViewType.article;
        data.pageTypeData = { article: page.article };
        break;
      case PageViewType.rodoArticle:
        data.view = PageViewType.rodoArticle;
        data.pageTypeData = { article: page.article };
        break;
      case PageViewType.aboutArticleMapsView:
        data.view = PageViewType.aboutArticleMapsView;
        data.pageTypeData = { article: page.article };
        break;
      case PageViewType.contact:
        data.view = PageViewType.contact;
        const pageContact = await this.departmentWebService.findContactPageData(
          page,
        );
        data.pageTypeData = { pageContact };
        break;
      case PageViewType.articles:
        data.view = PageViewType.articles;
        const articles = await this.articleWebServiceService.getArticlesPages(
          query,
          page?.category?.id,
        );
        if (articles.results.length > 0) {
          data.pageTypeData = { articles };
        } else {
          data.view = 'error404';
        }
        break;
      case PageViewType.blank:
        data.view = 'error404';
        break;
      case PageViewType.doubleArticle:
        data.view = PageViewType.doubleArticle;
        data.pageTypeData = { article: page.article };
        break;
      case PageViewType.department:
        data.view = PageViewType.department;
        const department = await this.departmentWebService.getDepartmentDataByAlias(
          page.department.alias,
          false,
        );
        data.pageTypeData = { department };
        break;
      case PageViewType.invests:
        data.view = PageViewType.invests;
        const variants: Variant[] = await this.variantWebService.getPageVariants(
          page.id,
        );
        data.pageTypeData = {
          variants,
        };
        break;
      case PageViewType.notices:
        data.view = PageViewType.notices;
        const messages: Message[] = await this.noticeWebService.all();
        data.pageTypeData = { notices: messages };
        break;
    }
    return data;
  }

  async dynamicUrlParse(
    path: string,
    paramsList: ParamsList,
  ): Promise<PageData> {
    const parentPage: {
      page: Page;
      lastParamsDynamicIndex: number;
    } = await this.findPageByParams(paramsList);
    if (!parentPage?.page) {
      return {
        data: {
          view: 'error404',
          isPage: false,
        },
      };
    }
    const dynamicDataAndView: {
      dynamicView: DynamicView | 'error404';
      data?: DynamicData;
    } = await this.findDynamicPageData(
      parentPage.page,
      path,
      paramsList,
      parentPage.lastParamsDynamicIndex,
    );
    return {
      parentPage: parentPage.page,
      data: {
        view: dynamicDataAndView.dynamicView,
        isPage: false,
        dynamicData: dynamicDataAndView.data,
      },
    };
  }

  async findPageByParams(
    paramsList: ParamsList,
  ): Promise<{ page: Page; lastParamsDynamicIndex: number }> {
    const {
      params,
      pageExistsParamsLength,
    } = PageDataFinderService.paramsParse(paramsList);
    if (pageExistsParamsLength <= 1) {
      return null;
    }
    const lastParamDynamicPage: Page = await this.findPageByPath(
      '/' + params.slice(0, pageExistsParamsLength - 1).join('/'),
    );

    if (!lastParamDynamicPage && pageExistsParamsLength > 2) {
      const doubleParamsDynamic: Page = await this.findPageByPath(
        '/' + params.slice(0, pageExistsParamsLength - 2).join('/'),
      );
      return {
        page: doubleParamsDynamic,
        lastParamsDynamicIndex: pageExistsParamsLength - 1,
      };
    }

    return {
      page: lastParamDynamicPage,
      lastParamsDynamicIndex: pageExistsParamsLength - 1,
    };
  }

  async findPageByPath(path: string): Promise<Page> {
    return await this.pageRepository.findOne({
      where: { path },
      relations: this.pageRelations,
    });
  }

  async findDynamicPageData(
    parentPage: Page,
    path: string,
    paramsList: ParamsList,
    lastParamsDynamicIndex,
  ): Promise<{ dynamicView: DynamicView | 'error404'; data?: DynamicData }> {
    let responseData: {
      dynamicView: DynamicView | 'error404';
      data?: DynamicData;
    } = {
      dynamicView: 'error404',
    };

    const {
      params,
      pageExistsParams,
      pageExistsParamsLength,
    } = PageDataFinderService.paramsParse(paramsList);

    const lastParamsValue: string =
      pageExistsParams[pageExistsParams.length - 1];

    switch (parentPage.viewType) {
      case 'invests':
        if (lastParamsDynamicIndex === 2) {
          const invest: InvestDynamicData = await this.investitionWebService.getInvestitionByAlias(
            pageExistsParams[pageExistsParams.length - 1],
          );
          if (invest) {
            invest.parentVariant = await this.variantWebService.getVariantByPath(
              `/${pageExistsParams[0]}/${pageExistsParams[1]}`,
            );

            if (invest.parentVariant) {
              const investHasVariants: Variant[] = invest.investData.variants.filter(
                (variant) => {
                  return invest.parentVariant.id === variant.id;
                },
              );

              if (investHasVariants.length > 0) {
                invest.contactOfficesPage = await this.pageRepository.findOne({
                  where: {
                    viewType: PageViewType.contact,
                  },
                });
                invest.departmentWithOffices = await this.departmentWebService.getDepartmentByViewType(
                  DepartmentType.sellOfficeList,
                );
                if (invest.departmentWithOffices) {
                  invest.officesInContactIds = (invest.departmentWithOffices
                    .officesMap as unknown) as number[];
                } else {
                  invest.officesInContactIds = [];
                }
                responseData = {
                  dynamicView: DynamicView.invest,
                  data: {
                    invest,
                  },
                };
              }
            }
          }
        } else {
          const investVariantData = await this.investitionWebService.getInvestionsByVariantPath(
            '/' + path,
            parentPage,
          );
          if (investVariantData) {
            responseData = {
              dynamicView: DynamicView.variant,
              data: {
                invests: investVariantData,
              },
            };
          }
        }
        break;
      case 'articles':
        const article: Article = await this.articleWebServiceService.getArticleByAlias(
          lastParamsValue,
        );
        if (article) {
          responseData = {
            dynamicView: DynamicView.article,
            data: {
              article: {
                articleData: article,
              },
            },
          };
        }
        break;
      case 'notices':
        const noticeData: Message = await this.noticeWebService.getOneByAlias(
          lastParamsValue,
        );
        responseData = {
          dynamicView: DynamicView.notice,
          data: {
            notice: {
              noticeData,
            },
          },
        };
        break;
      case 'contact':
        const departmentData = await this.departmentWebService.getDepartmentDataByAlias(
          pageExistsParams[pageExistsParams.length - 1],
        );
        if (departmentData) {
          const mainDepartment: Department = await this.departmentWebService.findMainDepartment();
          const otherDepartments: Department[] = await this.departmentWebService.findOtherDepartments();
          responseData = {
            dynamicView: DynamicView.department,
            data: {
              departmentData: {
                data: departmentData,
                mainDepartment,
                otherDepartments,
              },
            },
          };
        }
        break;
      default:
        break;
    }
    return responseData;
  }

  async getLeftPages(ids: number[]): Promise<Page[]> {
    const leftPages: Page[] = [];
    await map(ids, async (id, i) => {
      leftPages[i] = await this.pageRepository.findOne(id);
    });
    return leftPages;
  }

  static paramsParse(paramsList: ParamsList) {
    const params: string[] = Object.values(paramsList);
    const pageExistsParams: string[] = params.filter((value) => !!value);
    const pageExistsParamsLength: number = pageExistsParams.length;
    return {
      params,
      pageExistsParams,
      pageExistsParamsLength,
    };
  }

  async getContextMenus(pageData: PageData): Promise<ContextMenus> {
    return await this.findContextMenusByType(pageData);
  }

  async findContextMenusByType(pageData: PageData): Promise<ContextMenus> {
    const contextMenus: ContextMenus = {
      contextMenuTop: [],
      contextMenuBottom: [],
    };
    switch (pageData.data.view) {
      case PageViewType.main:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.invests:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        const elementsMenuBottom: ContextMenuElement[] = this.getVariantsLinks(
          pageData.data.pageTypeData.variants,
        );

        contextMenus.contextMenuBottom = [
          ...contextMenus.contextMenuBottom,
          ...elementsMenuBottom,
        ];
        break;
      case PageViewType.articles:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.article:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.doubleArticle:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.rodoArticle:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.aboutArticleMapsView:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.notices:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.doubleArticle:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.department:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.contact:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case PageViewType.blank:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.page.contextMenuBottom),
        );
        break;
      case DynamicView.article:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuBottom),
        );
        break;
      case DynamicView.notice:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuBottom),
        );
        break;
      case DynamicView.variant:
        contextMenus.contextMenuTop = this.getVariantsLinks(
          pageData.data.dynamicData.invests.pageVariants,
        );

        const elementsMenuTop: ContextMenuElement[] = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuTop),
        );

        contextMenus.contextMenuTop = [
          ...contextMenus.contextMenuTop,
          ...elementsMenuTop,
        ];
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuBottom),
        );
        break;
      case DynamicView.department:
        contextMenus.contextMenuTop = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuTop),
        );
        contextMenus.contextMenuBottom = await this.getLinksByIds(
          <number[]>(<unknown>pageData.parentPage.contextMenuBottom),
        );
        break;
      case DynamicView.invest:
        contextMenus.contextMenuTop = [];
        const elementsMenuTopInv: ContextMenuElement[] = this.getVariantsLinks(
          pageData.parentPage.variants,
        );

        contextMenus.contextMenuTop = [
          ...contextMenus.contextMenuTop,
          ...elementsMenuTopInv,
        ];
        break;
    }

    return contextMenus;
  }

  async getLinksByIds(ids: number[]): Promise<ContextMenuElement[]> {
    const pages: Page[] = [];
    await map(ids, async (id, i) => {
      pages[i] = await this.pageRepository.findOne(id);
    });
    return pages.map((page) => {
      return {
        id: page.id,
        type: 'page',
        path: page.path,
        name: page.linkTitle || page.title,
        defaultName: page.title,
      };
    });
  }

  getVariantsLinks(variants: Variant[]): ContextMenuElement[] {
    return variants.map((variant) => {
      return {
        id: variant.id,
        type: 'variant',
        path: variant.path,
        name: variant.linkName,
        defaultName: variant.name,
      };
    });
  }
}
