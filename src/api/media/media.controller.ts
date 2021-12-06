import { Body, Controller, Post, Res } from '@nestjs/common';
import { CroppedImageService } from '../../services/cropped-image/cropped-image.service';
import { CroppedImageDto } from '../../dto/cropped-image.dto';

@Controller('api/media')
export class MediaController {
  constructor(private readonly croppedImageService: CroppedImageService) {}

  @Post('image/cropped')
  async croppedImage(@Res() res, @Body() body: CroppedImageDto) {
    const imageUri: { path: string; sizeString: string } = <
      { path: string; sizeString: string }
    >await this.croppedImageService.makeCroppedImage(
      body.croppedImage,
      body.folder,
      body.imageFormat,
      true,
    );
    if (imageUri) {
      return res.json({
        src: imageUri?.path,
        sizeString: imageUri?.sizeString,
      });
    } else {
      return res.json(null);
    }
  }
}
