import { ServicesModule } from 'src/services/services.module';
import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';

@Module({
  imports: [ServicesModule],
  controllers: [ArticleController],
})
export class ArticleModule {}
