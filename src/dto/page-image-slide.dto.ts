import { ApiProperty } from '@nestjs/swagger';
export class PageImageSlideDto {
  @ApiProperty()
  slide: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  id: number;
}
