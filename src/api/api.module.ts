import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { PageModule } from './page/page.module';
import { ContactModule } from './contact/contact.module';
import { VariantModule } from './variant/variant.module';
import { DepartmentModule } from './department/department.module';
import { OfficeModule } from './office/office.module';
import { CategoryModule } from './category/category.module';
import { InvestitionModule } from './investition/investition.module';
import { UploadGalleryModule } from './upload-gallery/upload-gallery.module';
import { MediaModule } from './media/media.module';
import { MessageModule } from './message/message.module';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { PositionModule } from './position/position.module';
import { PopupModule } from './popup/popup.module';
import { FormModule } from './form/form.module';
import { AuthSimpleMiddleware } from '../middlewares/auth-simple.middleware';
import { ServicesModule } from '../services/services.module';
import { ArticleController } from './article/article.controller';
import { InvestitionController } from './investition/investition.controller';
import { CategoryController } from './category/category.controller';
import { ContactController } from './contact/contact.controller';
import { DepartmentController } from './department/department.controller';
import { MediaController } from './media/media.controller';
import { MessageController } from './message/message.controller';
import { OfficeController } from './office/office.controller';
import { PageController } from './page/page.controller';
import { PopupController } from './popup/popup.controller';
import { PositionController } from './position/position.controller';
import { UploadFilesController } from './upload-files/upload-files.controller';
import { UploadGalleryController } from './upload-gallery/upload-gallery.controller';
import { VariantController } from './variant/variant.controller';

@Module({
  imports: [
    AuthModule,
    ArticleModule,
    PageModule,
    ContactModule,
    VariantModule,
    DepartmentModule,
    OfficeModule,
    CategoryModule,
    InvestitionModule,
    UploadGalleryModule,
    MediaModule,
    MessageModule,
    UploadFilesModule,
    PositionModule,
    PopupModule,
    FormModule,
    ServicesModule,
  ],
  controllers: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSimpleMiddleware)
      .forRoutes(
        ArticleController,
        InvestitionController,
        CategoryController,
        ContactController,
        DepartmentController,
        InvestitionController,
        MediaController,
        MessageController,
        OfficeController,
        PageController,
        PopupController,
        PositionController,
        UploadFilesController,
        UploadGalleryController,
        VariantController,
      );
  }
}
