import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { PageController } from './page/page.controller';
import { WebServicesModule } from './web-services/web-services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesList } from '../config/typeorm.config';

@Module({
  controllers: [AdminController, PageController],
  imports: [WebServicesModule, TypeOrmModule.forFeature(entitiesList)],
  providers: [],
})
export class WebModule {}
