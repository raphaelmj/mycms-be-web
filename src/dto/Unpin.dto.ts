import { ApiProperty } from '@nestjs/swagger';
import { Popup } from '../entities/Popup';
export class UnpinDto {
  @ApiProperty()
  popup: Popup;
  @ApiProperty()
  popupEntityType: string;
  @ApiProperty()
  entityId: number;
}
