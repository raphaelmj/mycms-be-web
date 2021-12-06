import { ApiProperty } from '@nestjs/swagger';
import { LinkedInfoElement } from '../interfaces/linked-info-element.interface';

export class MessageDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  alias?: string;
  @ApiProperty()
  krs: string;
  @ApiProperty()
  nip: string;
  @ApiProperty()
  regon: string;
  @ApiProperty()
  court: string;
  @ApiProperty()
  place: string;
  @ApiProperty()
  capital: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  linkedInfo: LinkedInfoElement[];
  createdAt: Date | string;
}
