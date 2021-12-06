import { ApiProperty } from '@nestjs/swagger';
import { ImageFormat } from '../types/image-format';

export class CroppedImageDto {
  @ApiProperty()
  croppedImage: string;
  @ApiProperty()
  folder: string;
  @ApiProperty()
  imageFormat: ImageFormat;
}
