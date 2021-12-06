import { ApiProperty } from '@nestjs/swagger';
export class ContactMailDataDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  reg1: true;
  @ApiProperty()
  reg2: true;
  @ApiProperty()
  reg3: true;
  @ApiProperty()
  sendTo: string;
}
