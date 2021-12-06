import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ContactService } from '../../services/contact/contact.service';
import { ContactDto } from '../../dto/contact.dto';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(await this.contactService.all(['variants', 'pages']));
  }

  @Get('one/:id')
  async getOneById(@Res() res, @Param() params) {
    return res.json(await this.contactService.getById(params.id));
  }

  @Post('update')
  async update(@Res() res, @Body() body: ContactDto) {
    return res.json(await this.contactService.update(body));
  }

  @Post('create')
  async create(@Res() res, @Body() body: ContactDto) {
    return res.json(await this.contactService.create(body));
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.contactService.delete(params.id));
  }
}
