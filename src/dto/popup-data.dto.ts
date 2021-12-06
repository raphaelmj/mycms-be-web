import { ApiProperty } from '@nestjs/swagger';
import { PopupImageDto } from './popup-image.dto';

export class PopupDataDto {
  @ApiProperty()
  hasLink: boolean;
  @ApiProperty()
  link: string;
  @ApiProperty()
  target: string;
  @ApiProperty()
  image?: PopupImageDto;
}
