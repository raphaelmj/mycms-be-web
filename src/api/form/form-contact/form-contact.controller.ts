import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ContactMailService } from '../../../services/contact-mail/contact-mail.service';
import { ContactMailDataDto } from '../../../dto/contact-mail-data.dto';

@Controller('api/form/contact')
export class FormContactController {
  constructor(private contactMailService: ContactMailService) {}

  @Post('send')
  async sendContactForm(
    @Req() req,
    @Res() res,
    @Body() body: ContactMailDataDto,
  ) {
    const fullUrl = this.getHostAndPort(req);
    await this.contactMailService.sendEmailPerson(body, fullUrl);
    await this.contactMailService.sendEmailCustomer(body, fullUrl);
    return res.json(body);
  }

  getHostAndPort(req) {
    return (true ? 'https' : 'http') + '://' + req.headers.host;
  }
}
