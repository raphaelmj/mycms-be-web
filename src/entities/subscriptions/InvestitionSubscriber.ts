import { Investition } from './../Investition';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class InvestitionSubscriber
  implements EntitySubscriberInterface<Investition> {
  listenTo() {
    return Investition;
  }

  afterLoad(entity: Investition) {
    if (entity.gallery) entity.gallery = JSON.parse(entity.gallery);
    if (entity.progressGallery)
      entity.progressGallery = JSON.parse(entity.progressGallery);
    if (entity.customTable) entity.customTable = JSON.parse(entity.customTable);
    if (entity.link) entity.link = JSON.parse(entity.link);
    if (entity.contacts) entity.contacts = JSON.parse(entity.contacts);
    if (entity.mapFiles) entity.mapFiles = JSON.parse(entity.mapFiles);
    if (entity.webMap) entity.webMap = JSON.parse(entity.webMap);
  }

  afterInsert(event: InsertEvent<Investition>) {
    if (event.entity.gallery)
      event.entity.gallery = JSON.parse(event.entity.gallery);
    if (event.entity.progressGallery)
      event.entity.progressGallery = JSON.parse(event.entity.progressGallery);
    if (event.entity.customTable)
      event.entity.customTable = JSON.parse(event.entity.customTable);
    if (event.entity.link) event.entity.link = JSON.parse(event.entity.link);
    if (event.entity.contacts)
      event.entity.contacts = JSON.parse(event.entity.contacts);
    if (event.entity.mapFiles)
      event.entity.mapFiles = JSON.parse(event.entity.mapFiles);
    if (event.entity.webMap)
      event.entity.webMap = JSON.parse(event.entity.webMap);
  }

  beforeInsert(event: InsertEvent<Investition>) {
    if (typeof event.entity.gallery == 'object')
      event.entity.gallery = JSON.stringify(event.entity.gallery);
    if (typeof event.entity.progressGallery == 'object')
      event.entity.progressGallery = JSON.stringify(
        event.entity.progressGallery,
      );
    if (typeof event.entity.customTable == 'object')
      event.entity.customTable = JSON.stringify(event.entity.customTable);
    if (typeof event.entity.link == 'object')
      event.entity.link = JSON.stringify(event.entity.link);
    if (typeof event.entity.contacts == 'object')
      event.entity.contacts = JSON.stringify(event.entity.contacts);
    if (typeof event.entity.mapFiles == 'object')
      event.entity.mapFiles = JSON.stringify(event.entity.mapFiles);
    if (typeof event.entity.webMap == 'object')
      event.entity.webMap = JSON.stringify(event.entity.webMap);
  }

  beforeUpdate(event: UpdateEvent<Investition>) {
    if (typeof event.entity.gallery == 'object')
      event.entity.gallery = JSON.stringify(event.entity.gallery);
    if (typeof event.entity.progressGallery == 'object')
      event.entity.progressGallery = JSON.stringify(
        event.entity.progressGallery,
      );
    if (typeof event.entity.customTable == 'object')
      event.entity.customTable = JSON.stringify(event.entity.customTable);
    if (typeof event.entity.link == 'object')
      event.entity.link = JSON.stringify(event.entity.link);
    if (typeof event.entity.contacts == 'object')
      event.entity.contacts = JSON.stringify(event.entity.contacts);
    if (typeof event.entity.mapFiles == 'object')
      event.entity.mapFiles = JSON.stringify(event.entity.mapFiles);
    if (typeof event.entity.webMap == 'object')
      event.entity.webMap = JSON.stringify(event.entity.webMap);
  }
}
