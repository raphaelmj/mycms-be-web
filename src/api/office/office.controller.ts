import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { OfficeService } from '../../services/office/office.service';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { OfficeDto } from '../../dto/office.dto';

@Controller('api/office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(
      await this.officeService.all([
        'departments',
        'investitions',
        'pages',
        'variant',
      ]),
    );
  }

  @Put('set/main/:id')
  async setMain(@Res() res, @Param() params: { id: string }) {
    return res.json(await this.officeService.setMain(params.id));
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.officeService.updateField(body));
  }

  @Post('update')
  async update(@Res() res, @Body() body: OfficeDto) {
    return res.json(await this.officeService.update(body));
  }

  @Post('create')
  async create(@Res() res, @Body() body: OfficeDto) {
    return res.json(await this.officeService.create(body));
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.officeService.delete(params.id));
  }
}
