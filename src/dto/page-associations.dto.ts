import { ApiProperty } from '@nestjs/swagger';
export class PageAssociationsDto {
  @ApiProperty()
  articleId?: number;
  @ApiProperty()
  contactId?: number;
  @ApiProperty()
  categoryId?: number;
  @ApiProperty()
  officeId?: number;
  @ApiProperty()
  variantIds: number[];
  @ApiProperty()
  departmentIds: number[];
}
