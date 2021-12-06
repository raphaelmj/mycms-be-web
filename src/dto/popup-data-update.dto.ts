import { ApiProperty } from '@nestjs/swagger';
import { PopupDto } from './popup.dto';

export class PopupDataUpdateDto {
  @ApiProperty()
  popup: PopupDto;
  @ApiProperty()
  croppedImage: string | null;
  @ApiProperty({ required: false })
  ids?: number[];
}
