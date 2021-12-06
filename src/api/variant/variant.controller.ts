import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { VariantService } from '../../services/variant/variant.service';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { VariantDataDto } from '../../dto/variant-data.dto';
import { CroppedImageService } from '../../services/cropped-image/cropped-image.service';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';

@Controller('api/variant')
export class VariantController {
  constructor(
    private readonly variantService: VariantService,
    private readonly croppedImageService: CroppedImageService,
  ) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(
      await this.variantService.all(['page', 'investitions', 'popups']),
    );
  }

  @Post('create')
  async create(@Res() res, @Body() body: VariantDataDto) {
    const imagePath: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'variant-banners',
        'jpg',
      )
    );
    if (imagePath) {
      body.variant.banner = imagePath;
    }
    return res.json(await this.variantService.create(body.variant));
  }

  @Post('update')
  async update(@Res() res, @Body() body: VariantDataDto) {
    const imagePath: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'variant-banners',
        'jpg',
      )
    );
    if (imagePath) {
      body.variant.banner = imagePath;
    }
    return res.json(await this.variantService.update(body.variant));
  }

  @Get('page/:id/list')
  async pageVariants(@Res() res, @Param() params: { id: string }) {
    return res.json(await this.variantService.pageVariants(params.id));
  }

  @Post('order')
  async variantsOrder(@Res() res, @Body() body: number[]) {
    return res.json(await this.variantService.orderUpdate(body));
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.variantService.updateField(body));
  }

  @Delete('delete/:id')
  async remove(@Res() res, @Param() params) {
    return res.json(this.variantService.delete(params.id));
  }

  @Post('unpin/popup')
  async unpinPopup(@Req() req, @Body() body: UnpinDto) {
    return await this.variantService.unpinPopup(body);
  }

  @Post('pin/popup')
  async pinPopup(@Req() req, @Body() body: PinDto) {
    return await this.variantService.pinPopup(body);
  }
}
