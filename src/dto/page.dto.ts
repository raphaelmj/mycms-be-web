import { ApiProperty } from '@nestjs/swagger';
export class PageDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  linkTitle?: string;
}
