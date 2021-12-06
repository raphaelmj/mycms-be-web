import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Variant } from '../Variant';

@EventSubscriber()
export class VariantSubscriber implements EntitySubscriberInterface<Variant> {
  listenTo() {
    return Variant;
  }

  afterLoad(entity: Variant) {
    if (entity.color) entity.color = JSON.parse(entity.color);
    if (entity.params) entity.params = JSON.parse(entity.params);
    if (entity.contactsSections)
      entity.contactsSections = JSON.parse(entity.contactsSections);
    if (entity.link) entity.link = JSON.parse(entity.link);
    if (entity.investitionsMap)
      entity.investitionsMap = JSON.parse(entity.investitionsMap);
  }

  afterInsert(event: InsertEvent<Variant>) {
    if (event.entity.color) event.entity.color = JSON.parse(event.entity.color);
    if (event.entity.params)
      event.entity.params = JSON.parse(event.entity.params);
    if (event.entity.contactsSections)
      event.entity.contactsSections = JSON.parse(event.entity.contactsSections);
    if (event.entity.link) event.entity.link = JSON.parse(event.entity.link);
    if (event.entity.investitionsMap)
      event.entity.investitionsMap = JSON.parse(event.entity.investitionsMap);
  }

  beforeInsert(event: InsertEvent<Variant>) {
    if (typeof event.entity.color == 'object')
      event.entity.color = JSON.stringify(event.entity.color);
    if (typeof event.entity.params == 'object')
      event.entity.params = JSON.stringify(event.entity.params);
    if (typeof event.entity.contactsSections == 'object')
      event.entity.contactsSections = JSON.stringify(
        event.entity.contactsSections,
      );
    if (typeof event.entity.link == 'object')
      event.entity.link = JSON.stringify(event.entity.link);
    if (typeof event.entity.investitionsMap == 'object')
      event.entity.investitionsMap = JSON.stringify(
        event.entity.investitionsMap,
      );
  }

  beforeUpdate(event: UpdateEvent<Variant>) {
    if (event.entity) {
      if (typeof event.entity.color == 'object')
        event.entity.color = JSON.stringify(event.entity.color);
      if (typeof event.entity.params == 'object')
        event.entity.params = JSON.stringify(event.entity.params);
      if (typeof event.entity.contactsSections == 'object')
        event.entity.contactsSections = JSON.stringify(
          event.entity.contactsSections,
        );
      if (typeof event.entity.link == 'object')
        event.entity.link = JSON.stringify(event.entity.link);
      if (typeof event.entity.investitionsMap == 'object')
        event.entity.investitionsMap = JSON.stringify(
          event.entity.investitionsMap,
        );
    }
  }
}
