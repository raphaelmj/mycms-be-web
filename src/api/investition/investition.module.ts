import { Module } from '@nestjs/common';
import { InvestitionController } from './investition.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [InvestitionController],
})
export class InvestitionModule {}
