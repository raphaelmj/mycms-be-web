import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
