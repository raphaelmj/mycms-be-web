import { Module } from '@nestjs/common';
import { UploadFilesController } from './upload-files.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  controllers: [UploadFilesController],
  imports: [ServicesModule],
})
export class UploadFilesModule {}
