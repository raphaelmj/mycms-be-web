import { Controller, Get, Res } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('')
  index(@Res() res) {
    return res.sendFile(process.cwd() + '/static/ngadmin/index.html');
  }
}
