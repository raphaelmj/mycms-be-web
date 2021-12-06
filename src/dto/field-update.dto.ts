import { ApiProperty } from '@nestjs/swagger';

export class FieldUpdateDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  field: string;
  @ApiProperty()
  value: any;
}
