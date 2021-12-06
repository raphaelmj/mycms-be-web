import { Message } from './../Message';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
  listenTo() {
    return Message;
  }

  afterLoad(entity: Message) {
    if (entity.linkedInfo) entity.linkedInfo = JSON.parse(entity.linkedInfo);
  }

  afterInsert(event: InsertEvent<Message>) {
    if (event.entity.linkedInfo)
      event.entity.linkedInfo = JSON.parse(event.entity.linkedInfo);
  }

  beforeInsert(event: InsertEvent<Message>) {
    if (typeof event.entity.linkedInfo == 'object')
      event.entity.linkedInfo = JSON.stringify(event.entity.linkedInfo);
  }

  beforeUpdate(event: UpdateEvent<Message>) {
    if (typeof event.entity.linkedInfo == 'object')
      event.entity.linkedInfo = JSON.stringify(event.entity.linkedInfo);
  }
}
