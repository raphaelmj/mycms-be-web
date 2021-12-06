import { ApiProperty } from '@nestjs/swagger';
export class PinDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  popupEntityType: string;
  @ApiProperty()
  entityId: number;
}
