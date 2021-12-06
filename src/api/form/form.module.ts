import { Module } from '@nestjs/common';
import { FormContactController } from './form-contact/form-contact.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [FormContactController],
})
export class FormModule {}
