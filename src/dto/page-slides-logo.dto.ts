import { ApiProperty } from '@nestjs/swagger';
import { ImageFormat } from '../types/image-format';
export class PageSlidesLogoDto {
  @ApiProperty()
  croppedImage: string;
  @ApiProperty()
  imageFormat: ImageFormat;
  @ApiProperty()
  id: number;
  @ApiProperty()
  noImage: boolean;
  @ApiProperty()
  currentLogo: string;
}
