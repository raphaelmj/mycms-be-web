import { ApiProperty } from '@nestjs/swagger';
import { PersonElement } from '../interfaces/person-element.interface';

export class ContactElementDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  persons: PersonElement[];
}
