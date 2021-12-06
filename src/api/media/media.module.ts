import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  controllers: [MediaController],
  imports: [ServicesModule],
})
export class MediaModule {}
