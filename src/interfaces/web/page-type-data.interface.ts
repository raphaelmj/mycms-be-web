import { PartialsPageData } from './partials-page-data.interface';
import { Article } from '../../entities/Article';
import { ContactPageData } from './contact-page-data.interface';
import { DepartmentData } from './data-view-pack.interface';

export interface PageTypeData {
  articles?: PartialsPageData<Article>;
  article?: Article;
  pageContact?: ContactPageData;
  deparments?: any;
  department?: DepartmentData;
  variants?: any;
  notices?: any;
}
