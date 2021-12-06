import { mailerConfig } from './config/mailer.config';
import { Module } from '@nestjs/common';
import { WebModule } from './web/web.module';
import { ApiModule } from './api/api.module';
import { ServicesModule } from './services/services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { typeOrmConfig } from './config/typeorm.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './filters/not-found-exception-filter';
import { WebServicesModule } from './web/web-services/web-services.module';

@Module({
  imports: [
    ApiModule,
    WebModule,
    ServicesModule,
    WebServicesModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
