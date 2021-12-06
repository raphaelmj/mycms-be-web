import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { DepartmentService } from '../../services/department/department.service';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { DepartmentDto } from '../../dto/department.dto';
import { IdsDto } from '../../dto/ids.dto';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';

@Controller('api/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(await this.departmentService.all(['offices', 'popups']));
  }

  @Put('set/main/:id')
  async setMain(@Res() res, @Param() params: { id: string }) {
    return res.json(await this.departmentService.setMain(params.id));
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.departmentService.updateField(body));
  }

  @Post('update/order')
  async updateOrder(@Res() res, @Body() body: IdsDto) {
    return res.json(await this.departmentService.updateOrder(body));
  }

  @Post('update')
  async update(@Res() res, @Body() body: DepartmentDto) {
    return res.json(await this.departmentService.update(body));
  }

  @Post('create')
  async create(@Res() res, @Body() body: DepartmentDto) {
    return res.json(await this.departmentService.create(body));
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.departmentService.delete(params.id));
  }

  @Post('unpin/popup')
  async unpinPopup(@Req() req, @Body() body: UnpinDto) {
    return await this.departmentService.unpinPopup(body);
  }

  @Post('pin/popup')
  async pinPopup(@Req() req, @Body() body: PinDto) {
    return await this.departmentService.pinPopup(body);
  }
}
