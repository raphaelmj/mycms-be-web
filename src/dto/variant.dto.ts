import { ApiProperty } from '@nestjs/swagger';
import { Color } from '../interfaces/color.interface';
import { VariantParams } from '../interfaces/variant-params.interface';
export class VariantDto {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  alias: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  linkName: string;
  @ApiProperty()
  color: Color;
  @ApiProperty()
  leftDescription: string;
  @ApiProperty()
  rightDescription: string;
  @ApiProperty()
  banner: string;
  @ApiProperty()
  params: VariantParams;
  @ApiProperty()
  ordering: number;
  @ApiProperty()
  metaTitle: string;
  @ApiProperty()
  metaKeywords: string;
  @ApiProperty()
  metaDescription: string;
  @ApiProperty()
  investitionsMap: number[];
}
