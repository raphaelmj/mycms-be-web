import { ApiProperty } from '@nestjs/swagger';
import { PopupDataDto } from './popup-data.dto';

export class PopupDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  popupData: PopupDataDto;
  @ApiProperty()
  showEveryWhere: boolean;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  pages: number[];
  @ApiProperty()
  variants: number[];
  @ApiProperty()
  departments: number[];
  @ApiProperty()
  investitions: number[];
}
