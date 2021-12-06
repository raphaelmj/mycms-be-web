import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Page } from '../Page';

@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {
  listenTo() {
    return Page;
  }

  afterLoad(entity: Page) {
    if (entity.slides) entity.slides = JSON.parse(entity.slides);
    if (entity.config) entity.config = JSON.parse(entity.config);
    if (entity.pageColor) entity.pageColor = JSON.parse(entity.pageColor);
    if (entity.rightLinks) entity.rightLinks = JSON.parse(entity.rightLinks);
    if (entity.leftPages) entity.leftPages = JSON.parse(entity.leftPages);
    if (entity.contextMenuTop)
      entity.contextMenuTop = JSON.parse(entity.contextMenuTop);
    if (entity.contextMenuBottom)
      entity.contextMenuBottom = JSON.parse(entity.contextMenuBottom);
  }

  afterInsert(event: InsertEvent<Page>) {
    if (event.entity.slides)
      event.entity.slides = JSON.parse(event.entity.slides);
    if (event.entity.config)
      event.entity.config = JSON.parse(event.entity.config);
    if (event.entity.pageColor)
      event.entity.pageColor = JSON.parse(event.entity.pageColor);
    if (event.entity.rightLinks)
      event.entity.rightLinks = JSON.parse(event.entity.rightLinks);
    if (event.entity.leftPages)
      event.entity.leftPages = JSON.parse(event.entity.leftPages);
    if (event.entity.contextMenuTop)
      event.entity.contextMenuTop = JSON.parse(event.entity.contextMenuTop);
    if (event.entity.contextMenuBottom)
      event.entity.contextMenuBottom = JSON.parse(
        event.entity.contextMenuBottom,
      );
  }

  beforeInsert(event: InsertEvent<Page>) {
    if (typeof event.entity.slides == 'object')
      event.entity.slides = JSON.stringify(event.entity.slides);
    if (typeof event.entity.config == 'object')
      event.entity.config = JSON.stringify(event.entity.config);
    if (typeof event.entity.pageColor == 'object')
      event.entity.pageColor = JSON.stringify(event.entity.pageColor);
    if (typeof event.entity.rightLinks == 'object')
      event.entity.rightLinks = JSON.stringify(event.entity.rightLinks);
    if (typeof event.entity.leftPages == 'object')
      event.entity.leftPages = JSON.stringify(event.entity.leftPages);
    if (typeof event.entity.contextMenuTop == 'object')
      event.entity.contextMenuTop = JSON.stringify(event.entity.contextMenuTop);
    if (typeof event.entity.contextMenuBottom == 'object')
      event.entity.contextMenuBottom = JSON.stringify(
        event.entity.contextMenuBottom,
      );
    if (!event.entity.metaKeywords) event.entity.metaKeywords = '';
    if (!event.entity.metaDescription) event.entity.metaDescription = '';
  }

  beforeUpdate(event: UpdateEvent<Page>) {
    if (typeof event.entity.slides == 'object')
      event.entity.slides = JSON.stringify(event.entity.slides);
    if (typeof event.entity.config == 'object')
      event.entity.config = JSON.stringify(event.entity.config);
    if (typeof event.entity.pageColor == 'object')
      event.entity.pageColor = JSON.stringify(event.entity.pageColor);
    if (typeof event.entity.rightLinks == 'object')
      event.entity.rightLinks = JSON.stringify(event.entity.rightLinks);
    if (typeof event.entity.leftPages == 'object')
      event.entity.leftPages = JSON.stringify(event.entity.leftPages);
    if (typeof event.entity.contextMenuTop == 'object')
      event.entity.contextMenuTop = JSON.stringify(event.entity.contextMenuTop);
    if (typeof event.entity.contextMenuBottom == 'object')
      event.entity.contextMenuBottom = JSON.stringify(
        event.entity.contextMenuBottom,
      );
  }
}
