import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  position: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phones: string[];
  @ApiProperty()
  description: string;
  @ApiProperty()
  showForm: boolean;
  @ApiProperty()
  status: boolean;
}
