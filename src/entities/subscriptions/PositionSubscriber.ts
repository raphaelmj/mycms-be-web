import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Position } from '../Position';

@EventSubscriber()
export class PositionSubscriber implements EntitySubscriberInterface<Position> {
  listenTo() {
    return Position;
  }

  afterLoad(entity: Position) {
    if (entity.pages) entity.pages = JSON.parse(entity.pages);
  }

  afterInsert(event: InsertEvent<Position>) {
    if (event.entity.pages) event.entity.pages = JSON.parse(event.entity.pages);
  }

  beforeInsert(event: InsertEvent<Position>) {
    if (typeof event.entity.pages == 'object')
      event.entity.pages = JSON.stringify(event.entity.pages);
  }

  beforeUpdate(event: UpdateEvent<Position>) {
    if (typeof event.entity.pages == 'object')
      event.entity.pages = JSON.stringify(event.entity.pages);
  }
}
