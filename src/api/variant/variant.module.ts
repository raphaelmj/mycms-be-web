import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [VariantController],
})
export class VariantModule {}
