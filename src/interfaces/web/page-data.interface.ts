import { Page } from '../../entities/Page';
import { StaticMenus } from './static-menus.interface';
import { DataViewPack } from './data-view-pack.interface';
import { ContextMenuElement } from './context-menu-element.interface';
import { Office } from '../../entities/Office';

export interface PageData {
  page?: Page;
  parentPage?: Page;
  data?: DataViewPack;
  mainOffice?: Office;
  staticMenus?: StaticMenus;
  leftPages?: Page[];
  contextMenuTop?: ContextMenuElement[];
  contextMenuBottom?: ContextMenuElement[];
  paginationConfig?: {
    limit: number;
  };
}
