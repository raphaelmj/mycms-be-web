import { ApiProperty } from '@nestjs/swagger';
export class ArticleDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  alias?: string;
  @ApiProperty({ required: false })
  image?: string;
  @ApiProperty()
  short: string;
  @ApiProperty()
  content?: string;
  @ApiProperty()
  leftContent?: string;
  @ApiProperty()
  rightContent?: string;
  @ApiProperty()
  publisedAt: any;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  metaTitle: string;
  @ApiProperty()
  metaKeywords: string;
  @ApiProperty()
  metaDescription: string;
}
