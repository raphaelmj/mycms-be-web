import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [ContactController],
})
export class ContactModule {}
