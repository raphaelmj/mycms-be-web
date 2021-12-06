import { ApiProperty } from '@nestjs/swagger';
import { PageImageSlideDto } from './page-image-slide.dto';
export class PageSlidesListDto {
  @ApiProperty()
  slides: PageImageSlideDto[];
  @ApiProperty()
  id: number;
}
