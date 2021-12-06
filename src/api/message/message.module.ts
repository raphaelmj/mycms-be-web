import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [MessageController],
})
export class MessageModule {}
