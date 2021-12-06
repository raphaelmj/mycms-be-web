import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import { Department } from '../Department';

@EventSubscriber()
export class DepartmentSubscriber
  implements EntitySubscriberInterface<Department> {
  listenTo() {
    return Department;
  }

  afterLoad(entity: Department) {
    if (entity.params) entity.params = JSON.parse(entity.params);
    if (entity.contactsSections)
      entity.contactsSections = JSON.parse(entity.contactsSections);
    if (entity.officesMap) entity.officesMap = JSON.parse(entity.officesMap);
  }

  afterInsert(event: InsertEvent<Department>) {
    if (event.entity.params)
      event.entity.params = JSON.parse(event.entity.params);
    if (event.entity.contactsSections)
      event.entity.contactsSections = JSON.parse(event.entity.contactsSections);
    if (event.entity.officesMap)
      event.entity.officesMap = JSON.parse(event.entity.officesMap);
  }

  beforeInsert(event: InsertEvent<Department>) {
    if (typeof event.entity.params == 'object')
      event.entity.params = JSON.stringify(event.entity.params);
    if (typeof event.entity.contactsSections == 'object')
      event.entity.contactsSections = JSON.stringify(
        event.entity.contactsSections,
      );
    if (typeof event.entity.officesMap == 'object')
      event.entity.officesMap = JSON.stringify(event.entity.officesMap);
  }

  beforeUpdate(event: UpdateEvent<Department>) {
    if (typeof event.entity.params == 'object')
      event.entity.params = JSON.stringify(event.entity.params);
    if (typeof event.entity.contactsSections == 'object')
      event.entity.contactsSections = JSON.stringify(
        event.entity.contactsSections,
      );
    if (typeof event.entity.officesMap == 'object')
      event.entity.officesMap = JSON.stringify(event.entity.officesMap);
  }
}
