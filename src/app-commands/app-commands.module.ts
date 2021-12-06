import { entitiesList } from './../config/typeorm.config';
import { PositionCommandService } from './position-command.service';
import { UserCommandService } from './user-command.service';
import { mailerConfig } from './../config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { ServicesModule } from 'src/services/services.module';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { VariantCommandService } from './variant-command.service';
import { InvestitionCommandService } from './investition-command.service';
import { CategoryCommandService } from './category-command.service';
import { PageCommandService } from './page-command.service';
import { DepartmentCommandService } from './department-command.service';
import { OfficeCommandService } from './office-command.service';
import { ContactCommandService } from './contact-command.service';
import { ArticleCommandService } from './article-command.service';
import { MessageCommandService } from './message-command.service';
import { AssociationsCommandService } from './associations-command.service';
import { PopupsCommandService } from './popups-command.service';
import { CustomCommandsService } from './custom-commands.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature(entitiesList),
    MailerModule.forRoot(mailerConfig),
    ConsoleModule,
    ServicesModule,
  ],
  providers: [
    UserCommandService,
    PositionCommandService,
    VariantCommandService,
    InvestitionCommandService,
    CategoryCommandService,
    PageCommandService,
    DepartmentCommandService,
    OfficeCommandService,
    ContactCommandService,
    ArticleCommandService,
    MessageCommandService,
    AssociationsCommandService,
    PopupsCommandService,
    CustomCommandsService,
  ],
  exports: [
    UserCommandService,
    PositionCommandService,
    VariantCommandService,
    InvestitionCommandService,
    CategoryCommandService,
    PageCommandService,
    DepartmentCommandService,
    OfficeCommandService,
    ContactCommandService,
    ArticleCommandService,
    MessageCommandService,
    AssociationsCommandService,
    PopupsCommandService,
    CustomCommandsService,
  ],
})
export class AppCommandsModule {}
