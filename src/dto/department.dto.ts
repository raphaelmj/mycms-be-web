import { ApiProperty } from '@nestjs/swagger';
import { DepartmentType } from '../enums/department-type.enum';
import { PageDto } from './page.dto';
import { ContactElementDto } from './contact-element.dto';
import { Type } from '@nestjs/common';

export class DepartmentDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  alias?: string;
  @ApiProperty({ enum: DepartmentType })
  viewType: DepartmentType;
  @ApiProperty()
  params: Record<any, unknown>;
  @ApiProperty()
  main: boolean;
  @ApiProperty()
  metaTitle: string;
  @ApiProperty()
  metaKeywords: string;
  @ApiProperty()
  metaDescription: string;
  @ApiProperty()
  offices: any[];
  @ApiProperty({ required: false })
  pages?: PageDto[];
  @ApiProperty({
    type: ContactElementDto as Type<ContactElementDto>,
    isArray: true,
  })
  contactsSections: ContactElementDto[];
  @ApiProperty()
  officesMap: number[];
  @ApiProperty()
  ordering: number;
  @ApiProperty()
  showOnPage?: boolean;
}
