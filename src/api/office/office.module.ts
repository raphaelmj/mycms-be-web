import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [OfficeController],
})
export class OfficeModule {}
