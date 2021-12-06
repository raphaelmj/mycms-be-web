import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Office } from '../Office';

@EventSubscriber()
export class OfficeSubscriber implements EntitySubscriberInterface<Office> {
  listenTo() {
    return Office;
  }

  afterLoad(entity: Office) {
    if (entity.phones) entity.phones = JSON.parse(entity.phones);
    if (entity.emails) entity.emails = JSON.parse(entity.emails);
    if (entity.mapFiles) entity.mapFiles = JSON.parse(entity.mapFiles);
    if (entity.mainMapFiles)
      entity.mainMapFiles = JSON.parse(entity.mainMapFiles);
    if (entity.contactsSections)
      entity.contactsSections = JSON.parse(entity.contactsSections);
    if (entity.hours) entity.hours = JSON.parse(entity.hours);
  }

  afterInsert(event: InsertEvent<Office>) {
    if (event.entity.phones)
      event.entity.phones = JSON.parse(event.entity.phones);
    if (event.entity.emails)
      event.entity.emails = JSON.parse(event.entity.emails);
    if (event.entity.mapFiles)
      event.entity.mapFiles = JSON.parse(event.entity.mapFiles);
    if (event.entity.mainMapFiles)
      event.entity.mainMapFiles = JSON.parse(event.entity.mainMapFiles);
    if (event.entity.contactsSections)
      event.entity.contactsSections = JSON.parse(event.entity.contactsSections);
    if (event.entity.hours) event.entity.hours = JSON.parse(event.entity.hours);
  }

  beforeInsert(event: InsertEvent<Office>) {
    if (typeof event.entity.phones == 'object')
      event.entity.phones = JSON.stringify(event.entity.phones);
    if (typeof event.entity.emails == 'object')
      event.entity.emails = JSON.stringify(event.entity.emails);
    if (typeof event.entity.mapFiles == 'object')
      event.entity.mapFiles = JSON.stringify(event.entity.mapFiles);
    if (typeof event.entity.mainMapFiles == 'object')
      event.entity.mainMapFiles = JSON.stringify(event.entity.mainMapFiles);
    if (typeof event.entity.contactsSections == 'object')
      event.entity.contactsSections = JSON.stringify(
        event.entity.contactsSections,
      );
    if (typeof event.entity.hours == 'object')
      event.entity.hours = JSON.stringify(event.entity.hours);
  }

  beforeUpdate(event: UpdateEvent<Office>) {
    if (typeof event.entity.phones == 'object')
      event.entity.phones = JSON.stringify(event.entity.phones);
    if (typeof event.entity.emails == 'object')
      event.entity.emails = JSON.stringify(event.entity.emails);
    if (typeof event.entity.mapFiles == 'object')
      event.entity.mapFiles = JSON.stringify(event.entity.mapFiles);
    if (typeof event.entity.mainMapFiles == 'object')
      event.entity.mainMapFiles = JSON.stringify(event.entity.mainMapFiles);
    if (typeof event.entity.contactsSections == 'object')
      event.entity.contactsSections = JSON.stringify(
        event.entity.contactsSections,
      );
    if (typeof event.entity.hours == 'object')
      event.entity.hours = JSON.stringify(event.entity.hours);
  }
}
