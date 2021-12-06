import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Popup } from '../Popup';

@EventSubscriber()
export class PopupSubscriber implements EntitySubscriberInterface<Popup> {
  listenTo() {
    return Popup;
  }

  afterLoad(entity: Popup) {
    if (entity.popupData) entity.popupData = JSON.parse(entity.popupData);
  }

  afterInsert(event: InsertEvent<Popup>) {
    if (event.entity.popupData)
      event.entity.popupData = JSON.parse(event.entity.popupData);
  }

  beforeInsert(event: InsertEvent<Popup>) {
    if (typeof event.entity.popupData == 'object')
      event.entity.popupData = JSON.stringify(event.entity.popupData);
  }

  beforeUpdate(event: UpdateEvent<Popup>) {
    if (typeof event.entity.popupData == 'object')
      event.entity.popupData = JSON.stringify(event.entity.popupData);
  }
}
