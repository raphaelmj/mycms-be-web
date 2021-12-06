import { PageTypeData } from './page-type-data.interface';
import { PageViewType } from '../../enums/page-view-type.enum';
import { DynamicView } from '../../enums/dynamic-view.enum';
import { WebContactElement } from './web-contact-element.interface';
import { Investition } from '../../entities/Investition';
import { Variant } from '../../entities/Variant';
import { Article } from '../../entities/Article';
import { Message } from '../../entities/Message';
import { Department } from '../../entities/Department';
import { OfficeData } from './office-data.interface';
import { Page } from '../../entities/Page';

export interface InvestDynamicData {
  investData?: Investition;
  contacts?: WebContactElement[];
  parentVariant?: Variant;
  contactOfficesPage?: Page;
  departmentWithOffices?: Department;
  officesInContactIds?: number[];
}

export interface InvestsDynamicData {
  invests?: Investition[];
  currentVariant?: Variant;
  pageVariants?: Variant[];
  contactsSections?: WebContactElement[];
}

export interface ArticleDynamicData {
  articleData?: Article;
}

export interface NoticeDynamicData {
  noticeData?: Message;
}

export interface DepartmentData {
  department: Department;
  contactGroups: WebContactElement[];
  departmentOffices: OfficeData[];
}

export interface DepartmentDynamicData {
  data: DepartmentData;
  mainDepartment?: Department;
  otherDepartments?: Department[];
}

export interface DynamicData {
  invest?: InvestDynamicData;
  invests?: InvestsDynamicData;
  article?: ArticleDynamicData;
  notice?: NoticeDynamicData;
  departmentData?: DepartmentDynamicData;
}

export interface DataViewPack {
  view: PageViewType | 'error404' | DynamicView;
  pageTypeData?: PageTypeData;
  dynamicData?: DynamicData;
  isPage: boolean;
}
