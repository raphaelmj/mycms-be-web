import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from './page.dto';
import { PageAssociationsDto } from './page-associations.dto';
export class PageDataUpdateDto {
  @ApiProperty()
  page: PageDto;
  @ApiProperty()
  associations?: PageAssociationsDto;
}
