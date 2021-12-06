import { entitiesList } from './../config/typeorm.config';
import { PasswordService } from 'src/services/password.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { ArticleService } from './article/article.service';
import { CroppedImageService } from './cropped-image/cropped-image.service';
import { CatalogService } from './catalog/catalog.service';
import { PageService } from './page/page.service';
import { VariantService } from './variant/variant.service';
import { CategoryService } from './category/category.service';
import { ContactService } from './contact/contact.service';
import { DepartmentService } from './department/department.service';
import { OfficeService } from './office/office.service';
import { InvestitionService } from './investition/investition.service';
import { ImageService } from './image/image.service';
import { MessageService } from './message/message.service';
import { PositionService } from './position/position.service';
import { PopupService } from './popup/popup.service';
import { ContactMailService } from './contact-mail/contact-mail.service';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    TypeOrmModule.forFeature(entitiesList),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '3600s' }, //'2177280000s'
    }),
  ],
  providers: [
    PasswordService,
    AuthService,
    ArticleService,
    CroppedImageService,
    CatalogService,
    PageService,
    VariantService,
    CategoryService,
    ContactService,
    DepartmentService,
    OfficeService,
    InvestitionService,
    ImageService,
    MessageService,
    PositionService,
    PopupService,
    ContactMailService,
  ],
  exports: [
    PasswordService,
    AuthService,
    ArticleService,
    CroppedImageService,
    CatalogService,
    PageService,
    VariantService,
    CategoryService,
    ContactService,
    DepartmentService,
    OfficeService,
    InvestitionService,
    ImageService,
    MessageService,
    PositionService,
    PopupService,
    ContactMailService,
  ],
})
export class ServicesModule {}
