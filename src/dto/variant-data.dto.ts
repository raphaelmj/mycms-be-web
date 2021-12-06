import { ApiProperty } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
export class VariantDataDto {
  @ApiProperty()
  croppedImage: string;
  @ApiProperty()
  variant: VariantDto;
}
