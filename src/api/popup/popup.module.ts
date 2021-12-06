import { Module } from '@nestjs/common';
import { PopupController } from './popup.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [PopupController],
})
export class PopupModule {}
