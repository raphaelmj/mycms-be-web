import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [PageController],
})
export class PageModule {}
