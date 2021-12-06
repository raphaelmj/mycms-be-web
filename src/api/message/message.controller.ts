import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { MessageService } from '../../services/message/message.service';
import { MessageDto } from '../../dto/message.dto';

@Controller('api/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(await this.messageService.all());
  }

  // @Post('update/field')
  // async updateField(@Res() res, @Body() body: FieldUpdateDto) {
  //   return res.json(await this.departmentService.updateField(body));
  // }

  @Post('update')
  async update(@Res() res, @Body() body: MessageDto) {
    return res.json(await this.messageService.update(body));
  }

  @Post('create')
  async create(@Res() res, @Body() body: MessageDto) {
    return res.json(await this.messageService.create(body));
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.messageService.delete(params.id));
  }
}
