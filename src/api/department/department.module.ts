import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
