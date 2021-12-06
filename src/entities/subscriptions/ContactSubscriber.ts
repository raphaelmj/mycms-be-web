import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Contact } from '../Contact';

@EventSubscriber()
export class ContactSubscriber implements EntitySubscriberInterface<Contact> {
  listenTo() {
    return Contact;
  }

  afterLoad(entity: Contact) {
    if (entity.phones) entity.phones = JSON.parse(entity.phones);
  }

  afterInsert(event: InsertEvent<Contact>) {
    if (event.entity.phones)
      event.entity.phones = JSON.parse(event.entity.phones);
  }

  beforeInsert(event: InsertEvent<Contact>) {
    if (typeof event.entity.phones == 'object')
      event.entity.phones = JSON.stringify(event.entity.phones);
  }

  beforeUpdate(event: UpdateEvent<Contact>) {
    if (typeof event.entity.phones == 'object')
      event.entity.phones = JSON.stringify(event.entity.phones);
  }
}
