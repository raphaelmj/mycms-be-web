import { Module } from '@nestjs/common';
import { UploadGalleryController } from './upload-gallery.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  controllers: [UploadGalleryController],
  imports: [ServicesModule],
})
export class UploadGalleryModule {}
