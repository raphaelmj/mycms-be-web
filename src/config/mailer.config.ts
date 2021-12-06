import * as config from 'config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

const mailConfig = config.get('mail');

export const mailerConfig: MailerOptions = {
  transport: {
    host: mailConfig.host,
    port: mailConfig.port,
    ignoreTLS: mailConfig.ignoreTLS,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.auth.user,
      pass: mailConfig.auth.pass,
    },
  },
  defaults: {
    from: mailConfig.defaults.from,
  },
  preview: false,
  template: {
    dir: process.cwd() + '/views/',
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};
