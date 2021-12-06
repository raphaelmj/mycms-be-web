import { Office } from '../../entities/Office';
import { WebContactElement } from './web-contact-element.interface';

export interface OfficeData {
  data: Office;
  contactGroups: WebContactElement[];
}
