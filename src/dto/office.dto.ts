import { ApiProperty } from '@nestjs/swagger';
import { MapFiles } from '../interfaces/map-files.interface';
import { ContactElementDto } from './contact-element.dto';
import { Type } from '@nestjs/common';

export class OfficeDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  alias?: string;
  @ApiProperty()
  subTitle: string;
  @ApiProperty()
  phones: string[];
  @ApiProperty()
  emails: string[];
  @ApiProperty()
  address: string;
  @ApiProperty()
  hours: string[];
  @ApiProperty()
  description: string;
  @ApiProperty()
  mapLat: number;
  @ApiProperty()
  mapLng: number;
  @ApiProperty()
  mapFiles: MapFiles;
  mainMapFiles: MapFiles;
  @ApiProperty()
  main: boolean;
  @ApiProperty({
    type: ContactElementDto as Type<ContactElementDto>,
    isArray: true,
  })
  contactsSections: ContactElementDto[];
  @ApiProperty()
  ordering: number;
}
