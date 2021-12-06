import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as config from 'config';
import { ContactMailDataDto } from '../../dto/contact-mail-data.dto';

const mailConfig = config.get('mail');

@Injectable()
export class ContactMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailPerson(contact: ContactMailDataDto, fullUrl: string) {
    const labels = {
      name: 'Imię i nazwisko',
      email: 'Email',
      phone: 'Telefon',
      description: 'Treść',
      reg1: 'regulamin 1',
      reg2: 'regulamin 2',
      reg3: 'regulamin 3',
    };

    let textString = '';
    const dataObject = [];
    Object.keys(contact).map((k, i) => {
      if (typeof contact[k] == 'boolean') {
        textString += labels[k] + ': ' + contact[k] ? 'zazanczone' : 'brak';
        dataObject.push({
          label: labels[k],
          value: contact[k] ? 'zazanczone' : 'brak',
        });
      } else if (typeof contact[k] == 'object') {
        textString +=
          labels[k] + ': ' + contact[k].min + ' - ' + contact[k].max;
        dataObject.push({
          label: labels[k],
          value: contact[k].min + ' - ' + contact[k].max,
        });
      } else if (k != 'sendTo') {
        textString += labels[k] + ': ' + contact[k];
        dataObject.push({
          label: labels[k],
          value: contact[k],
        });
      }
      if (i != Object.keys(contact).length - 1) {
        textString += ', ';
      }
    });

    const data: any = contact;
    data.fullUrl = fullUrl;

    return await this.mailerService.sendMail({
      to: [contact.sendTo],
      subject: 'Zapytanie ze strony Napollo.pl',
      text: textString,
      context: { data: dataObject, fullUrl },
      template: process.cwd() + '/views/emails/person',
    });
  }

  async sendEmailCustomer(contact: ContactMailDataDto, fullUrl: string) {
    if (contact.email && contact.email != '')
      return await this.mailerService.sendMail({
        to: [contact.email],
        subject: 'Dziękujemy za kontakt',
        text: '',
        context: {
          fullUrl,
        },
        template: process.cwd() + '/views/emails/customer',
      });
  }
}
