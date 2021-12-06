import { PersonElement } from './person-element.interface';

export interface ContactElement {
  name: string;
  persons: PersonElement[];
}
