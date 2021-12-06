import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [PositionController],
})
export class PositionModule {}
