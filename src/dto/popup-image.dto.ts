import { ApiProperty } from '@nestjs/swagger';
import { ImageOrientation } from '../interfaces/image-element.interface';

export class PopupImageDto {
  @ApiProperty()
  path: string;
  @ApiProperty()
  sizeString: string;
  @ApiProperty()
  orientation: ImageOrientation;
}
