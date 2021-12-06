import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { PositionService } from '../../services/position/position.service';
import { FieldUpdateDto } from '../../dto/field-update.dto';

@Controller('api/position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(await this.positionService.all());
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.positionService.updateField(body));
  }
}
