import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PopupService } from '../../services/popup/popup.service';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { PopupDataUpdateDto } from '../../dto/popup-data-update.dto';

@Controller('api/popup')
export class PopupController {
  constructor(private popupService: PopupService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(
      await this.popupService.all(['pages', 'variants', 'departments']),
    );
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.popupService.updateField(body));
  }

  @Post('create')
  async create(@Res() res, @Body() body: PopupDataUpdateDto) {
    return res.json(await this.popupService.create(body));
  }

  @Post('update')
  async update(@Res() res, @Body() body: PopupDataUpdateDto) {
    return res.json(await this.popupService.update(body));
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.popupService.delete(params.id));
  }
}
