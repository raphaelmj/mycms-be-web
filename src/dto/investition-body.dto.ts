import { ApiProperty } from '@nestjs/swagger';
import { InvestitionDto } from './investition.dto';
export class InvestitionBodyDto {
  @ApiProperty()
  croppedImageFull: string;
  @ApiProperty()
  croppedImageList: string;
  @ApiProperty()
  croppedImageLogo: string;
  @ApiProperty()
  croppedLessMap: string;
  @ApiProperty()
  croppedMoreMap: string;
  @ApiProperty()
  variantIds: number[];
  @ApiProperty()
  officeIds: number[];
  @ApiProperty()
  investition: InvestitionDto;
}
