import { ApiProperty } from '@nestjs/swagger';

export class ArticleQueryDto {
  @ApiProperty()
  page?: string;
  @ApiProperty()
  phrase?: string;
}
